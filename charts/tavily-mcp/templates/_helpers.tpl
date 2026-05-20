{{/*
Expand the name of the chart.
*/}}
{{- define "tavily-mcp.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Fullname: release-name + chart-name, truncated to 63 chars.
*/}}
{{- define "tavily-mcp.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Common labels.
*/}}
{{- define "tavily-mcp.labels" -}}
helm.sh/chart: {{ include "tavily-mcp.name" . }}-{{ .Chart.Version | replace "+" "_" }}
{{ include "tavily-mcp.selectorLabels" . }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels.
*/}}
{{- define "tavily-mcp.selectorLabels" -}}
app.kubernetes.io/name: {{ include "tavily-mcp.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Secret name — use existing or generated.
*/}}
{{- define "tavily-mcp.secretName" -}}
{{- if .Values.secret.existingSecret }}
{{- .Values.secret.existingSecret }}
{{- else }}
{{- include "tavily-mcp.fullname" . }}
{{- end }}
{{- end }}
