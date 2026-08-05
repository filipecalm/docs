<template>
  <div class="px-4 mt-5">
    <AvaliacaoAdmissaoRelatorio
      ref="avaliacaoAdmissaoRelatorio"
      :patient="patientContext"
    />
        <!-- Campo de Pesquisa -->
        <v-row dense>
            <v-text-field  v-model="searchQuery"  label="Pesquisar ABEMID / NEAD..."  outlined dense  prepend-inner-icon="mdi-magnify" ></v-text-field>
            <v-col md="2" > <v-btn class="mr-4 elevation-0" text @click="atualizar" >   <v-icon left>     mdi-reload   </v-icon> atualizar página </v-btn> </v-col>
        </v-row>
        <v-list dense> <v-progress-linear  v-if="isUploading"  :indeterminate="true"  color="blue"  loading-text="Carregando Informações...." ></v-progress-linear>
            
            <h3 class="blod_color mb-5">ABEMID / NEAD Carregadas:</h3>
            <v-alert
              v-if="canManageAdmissaoDocsDev && hiddenDocIds.length"
              type="info"
              dense
              outlined
              class="mb-3"
            >
              {{ hiddenDocIds.length }} documento(s) de admissão oculto(s) neste navegador (dev).
              <v-btn text small color="primary" class="ml-2" @click="restaurarDocumentosOcultosDev">
                Mostrar novamente
              </v-btn>
            </v-alert>
        <!-- Exibir apenas os exames filtrados -->
        <v-list-item-group v-for="(exame, index) in filteredExams" :key="index">
            <v-list-item class="my-2">
            <v-list-item-content>
                <v-list-item-title class="mb-2"> 
                <span class="font-weight-bold text-primary blod_color ">Id: {{exame.id }} - {{ exame.tipodoc.nome }}</span> 
                <br>
                <span>{{ extractFileName(exame.arquivo) }}</span>
                </v-list-item-title>
                <v-list-item-subtitle>
                Carregado em: {{ formatDate(exame.data_carregado) }}
                </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action class="documento-acoes">
                <v-btn
                  v-if="canManageAdmissaoDocsDev && isAdmissaoDocument(exame)"
                  small
                  outlined
                  color="primary"
                  :loading="managingDocId === exame.id"
                  :disabled="Boolean(managingDocId)"
                  @click="regenerarPdfAdmissao(exame)"
                >
                  <v-icon left small>mdi-file-refresh</v-icon>
                  Regenerar PDF
                </v-btn>
                <v-btn
                  v-if="canManageAdmissaoDocsDev && isAdmissaoDocument(exame)"
                  small
                  outlined
                  color="error"
                  :disabled="Boolean(managingDocId)"
                  @click="ocultarDocumentoAdmissaoDev(exame)"
                >
                  <v-icon left small>mdi-eye-off</v-icon>
                  Ocultar
                </v-btn>
                <v-btn small color="green" class="white--text" :href="exame.arquivo" target="_blank">
                <v-icon left>mdi-download</v-icon>
                Baixar
                </v-btn>
            </v-list-item-action>
            </v-list-item>
        </v-list-item-group>

        <!-- Mensagem quando não há exames -->
        <v-alert v-if="filteredExams.length === 0" type="info" outlined class="mt-4">
            Nenhum documento encontrado.
        </v-alert>
    </v-list>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import '../../../../../assets/css/styles.css';
import api from '../../../../../http';
import UtilsFunc from '../../../../../service/utilsFunc';
import AvaliacaoAdmissaoRelatorio from "@/components/relatorios/avaliacao/Avaliacao_admissao.vue";

const { withCRUDUtils } = UtilsFunc;
const ADMISSAO_TIPODOC_ID = 45;

export default {
  components: {
    AvaliacaoAdmissaoRelatorio,
  },
  data: () => withCRUDUtils({
    selectedDocumentType: null,
    uploadedDocuments: [],
    isUploading: false,
    searchQuery: "",
    patientContext: null,
    managingDocId: null,
    hiddenDocIds: [],
  }),
  props: {
    pacienteId: { type: Number }
  },
  computed: {
    ...mapGetters(["userData"]),
    canManageAdmissaoDocsDev() {
      if (import.meta.env.NODE_ENV === "production") return false;
      const user = this.userData || {};
      return Number(user.id) === 1 || user.is_superuser === true;
    },
    filteredExams() {
      const hiddenIds = new Set(this.hiddenDocIds.map(Number));
      return this.uploadedDocuments.filter((exame) => {
        if (hiddenIds.has(Number(exame.id))) return false;
        const fileName = this.extractFileName(exame.arquivo).toLowerCase();
        return fileName.includes(this.searchQuery.toLowerCase());
      });
    }
  },
  watch: {
    pacienteId: {
      immediate: true,
      handler() {
        this.loadHiddenDocIds();
      },
    },
  },
  methods: {
    async fetchUploadedDocuments() {
      this.isUploading = true;
      try {
        const { data } = await api.get(`/pacientes/docs/?paciente=${this.pacienteId}`);
        this.uploadedDocuments = data.filter((item) => item?.tipopasta?.id === 1 && item?.ativo !== false);
      } catch (error) {
        this.$toast.error(`Erro ao buscar documentos: ${error}`);
      } finally {
        this.isUploading = false;
      }
    },
    extractFileName(url) {
      if (!url) return "";
      return decodeURIComponent(url.split('/').pop());
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    },
    atualizar(){
        this.searchQuery = "";
        this.fetchUploadedDocuments();
    },
    getRelatedId(value) {
      if (value === null || value === undefined) return null;
      if (typeof value === "object") return value.id ?? value.pk ?? null;
      return value;
    },
    isAdmissaoDocument(doc) {
      const tipodocId = doc?.tipodoc?.id;
      if (tipodocId === ADMISSAO_TIPODOC_ID) return true;
      const tipoNome = String(doc?.tipodoc?.nome || "").toLowerCase();
      if (tipoNome.includes("admiss")) return true;
      return this.extractFileName(doc?.arquivo).toUpperCase().startsWith("RELATORIO_ADMISSAO_");
    },
    parseEvaluationDateFromFilename(filename) {
      const match = String(filename || "").match(/Avaliado_em_(\d{2}_\d{2}_\d{4})/i);
      if (!match) return null;
      const [day, month, year] = match[1].split("_");
      return `${year}-${month}-${day}`;
    },
    getSortableEvaluationDate(item) {
      const dateValue = item?.data_avaliacao || item?.data || item?.modified_at || item?.created_at || "";
      const timestamp = dateValue ? new Date(dateValue).getTime() : 0;
      return Number.isFinite(timestamp) ? timestamp : 0;
    },
    async fetchAdmissaoEvaluations() {
      const { data } = await api.get("nead_abemid/avaliacao_admissao/", {
        params: {
          paciente: this.pacienteId,
          ativo: true,
        },
      });
      return Array.isArray(data) ? data : data?.results || [];
    },
    findEvaluationForDocument(doc, evaluations) {
      const filename = this.extractFileName(doc?.arquivo);
      const parsedDate = this.parseEvaluationDateFromFilename(filename);
      const candidates = evaluations
        .filter((item) => String(this.getRelatedId(item?.paciente)) === String(this.pacienteId))
        .sort((a, b) => {
          const dateDiff = this.getSortableEvaluationDate(b) - this.getSortableEvaluationDate(a);
          if (dateDiff !== 0) return dateDiff;
          return (b?.id || 0) - (a?.id || 0);
        });

      if (!candidates.length) return null;
      if (!parsedDate) return candidates[0];

      const byDate = candidates.filter((item) => {
        const evaluationDate = item?.data_avaliacao || item?.data;
        if (!evaluationDate) return false;
        return moment(evaluationDate).format("YYYY-MM-DD") === parsedDate;
      });

      return byDate[0] || candidates[0];
    },
    async ensurePatientContext() {
      if (this.patientContext?.nome || this.patientContext?.nomecompleto) return this.patientContext;
      try {
        const { data } = await api.get(`/pacientes/listar-leve/?id=${this.pacienteId}&ativo=1`);
        this.patientContext = Array.isArray(data) ? data[0] || { id: this.pacienteId } : data || { id: this.pacienteId };
      } catch (error) {
        console.warn("Não foi possível carregar dados do paciente para regenerar PDF:", error);
        this.patientContext = { id: this.pacienteId };
      }
      return this.patientContext;
    },
    async salvarPdfNoProntuario(blob, filename) {
      if (!this.pacienteId || !(blob instanceof Blob) || !blob.size) return;

      const formPaciente = new FormData();
      formPaciente.append("arquivo", blob, filename);
      formPaciente.append("tipodoc", ADMISSAO_TIPODOC_ID);
      formPaciente.append("tipopasta", 1);
      formPaciente.append("ativo", true);
      formPaciente.append("paciente", this.pacienteId);
      formPaciente.append("data_carregado", new Date().toISOString().split("T")[0]);

      await api.post("/pacientes/docs/", formPaciente, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    getHiddenDocsStorageKey() {
      return `dev-hidden-admissao-docs:${this.pacienteId || "sem-paciente"}`;
    },
    loadHiddenDocIds() {
      if (!this.canManageAdmissaoDocsDev) {
        this.hiddenDocIds = [];
        return;
      }
      try {
        const raw = localStorage.getItem(this.getHiddenDocsStorageKey());
        const parsed = JSON.parse(raw || "[]");
        this.hiddenDocIds = Array.isArray(parsed)
          ? parsed.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0)
          : [];
      } catch (error) {
        this.hiddenDocIds = [];
      }
    },
    saveHiddenDocIds() {
      localStorage.setItem(this.getHiddenDocsStorageKey(), JSON.stringify(this.hiddenDocIds));
    },
    ocultarDocumentoAdmissaoDev(doc) {
      if (!this.canManageAdmissaoDocsDev || !doc?.id) return;

      const filename = this.extractFileName(doc.arquivo);
      const confirmed = window.confirm(
        `Ocultar documento Id ${doc.id} neste navegador?\n\n${filename}\n\nSó some da sua tela em dev. No servidor ele continua existindo.`
      );
      if (!confirmed) return;

      const hiddenIds = new Set(this.hiddenDocIds.map(Number));
      hiddenIds.add(Number(doc.id));
      this.hiddenDocIds = [...hiddenIds];
      this.saveHiddenDocIds();
      this.$toast.info("Documento oculto neste navegador (dev).");
    },
    restaurarDocumentosOcultosDev() {
      if (!this.canManageAdmissaoDocsDev) return;
      this.hiddenDocIds = [];
      localStorage.removeItem(this.getHiddenDocsStorageKey());
      this.$toast.info("Documentos ocultos restaurados neste navegador.");
    },
    async regenerarPdfAdmissao(doc) {
      if (!this.canManageAdmissaoDocsDev || !doc || this.managingDocId) return;

      this.managingDocId = doc.id;
      try {
        await this.ensurePatientContext();
        const evaluations = await this.fetchAdmissaoEvaluations();
        const evaluation = this.findEvaluationForDocument(doc, evaluations);
        if (!evaluation) {
          this.$toast.error("Não foi encontrada avaliação de admissão salva para regerar este PDF.");
          return;
        }

        this.$toast.info("Regenerando PDF de admissão. Aguarde...");
        const reportResult = await this.$refs.avaliacaoAdmissaoRelatorio?.generateAndDownload(evaluation);
        if (!reportResult?.blob) {
          this.$toast.error("Não foi possível gerar o PDF.");
          return;
        }

        await this.salvarPdfNoProntuario(reportResult.blob, reportResult.filename);
        this.$toast.success("PDF regenerado e salvo nos documentos do paciente.");
        await this.fetchUploadedDocuments();
      } catch (error) {
        console.error("Erro ao regenerar PDF de admissão:", error);
        this.$toast.error("Erro ao regenerar PDF de admissão.");
      } finally {
        this.managingDocId = null;
      }
    },
  },
  mounted() {
    this.fetchUploadedDocuments();
  }
};
</script>

<style scoped>
.documento-acoes {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
