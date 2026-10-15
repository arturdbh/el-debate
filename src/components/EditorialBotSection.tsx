import React, { useState, useRef } from 'react';
import { 
  Bot, 
  FileText, 
  Upload, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  Image as ImageIcon, 
  MapPin, 
  ArrowRight, 
  Trash2, 
  RefreshCw, 
  Calendar, 
  Database, 
  Zap, 
  PenTool, 
  Clock, 
  FileCheck, 
  AlertCircle,
  FolderArchive,
  Download,
  Eye,
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import { useNewspaper } from '../context/NewspaperContext';
import { parseWordFile, segmentArticlesFromText } from '../utils/wordDocumentParser';
import { ParsedWordArticle, RegionMunicipality, ArticleCategory } from '../types/newspaper';

export const EditorialBotSection: React.FC = () => {
  const { 
    publishBatchArticles, 
    dailyEditions, 
    loadEdition, 
    setCurrentTab,
    createDailyEditionBackup 
  } = useNewspaper();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSubTab, setActiveSubTab] = useState<'bot' | 'database'>('bot');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusLog, setStatusLog] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedList, setParsedList] = useState<ParsedWordArticle[]>([]);
  const [extractedPhotosCount, setExtractedPhotosCount] = useState<number>(0);
  const [publishSuccessNotice, setPublishSuccessNotice] = useState<string | null>(null);

  // Manual paste or test text mode
  const [showPasteMode, setShowPasteMode] = useState(false);
  const [pastedText, setPastedText] = useState('');

  const municipalities: RegionMunicipality[] = [
    'Cd. Altamirano (Pungarabato)',
    'Coyuca de Catalán',
    'Cutzamala de Pinzón',
    'Tlapehuala',
    'Arcelia',
    'Ajuchitlán del Progreso',
    'San Miguel Totolapan',
    'Zirándaro de los Chávez'
  ];

  const categories: ArticleCategory[] = [
    'Última Hora',
    'Región y Municipios',
    'Campo y Ganadería',
    'Cultura y Tradición',
    'Economía y Comercio',
    'Opinión y Debate',
    'Deportes Calentanos'
  ];

  // Handle Word File (.docx)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setFileName(file.name);
    setStatusLog([
      `Iniciando análisis del archivo: ${file.name}`,
      'Extrayendo texto y analizando estructura de títulos...',
    ]);

    try {
      const result = await parseWordFile(file);
      setParsedList(result.articles);
      setExtractedPhotosCount(result.extractedImagesCount);

      const featuredTitle = result.articles.find(a => a.isFeatured)?.title || result.articles[0]?.title;
      setStatusLog(prev => [
        ...prev,
        `✓ Se identificaron ${result.articles.length} notas periodísticas.`,
        `✓ Se procesaron ${result.extractedImagesCount} imágenes/fotos del documento.`,
        `★ NOTA PRINCIPAL DEL DÍA DETECTADA: "${featuredTitle}"`,
        'Listo para revisión y publicación en el diario.'
      ]);
    } catch (err) {
      console.error(err);
      setStatusLog(prev => [
        ...prev,
        '⚠️ Error al procesar el archivo Word. Se intentará lectura por texto alternativo.'
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Process sample Word document structure
  const loadSampleWordDocument = () => {
    setIsProcessing(true);
    setFileName('Edicion_El_Debate_Tierra_Caliente.docx');
    setStatusLog([
      'Cargando archivo Word de prueba: Edicion_El_Debate_Tierra_Caliente.docx',
      'Extrayendo secciones y clasificando por relevancia comunitaria...'
    ]);

    const sampleText = `
[NOTA PRINCIPAL DEL DÍA]
Inauguran con Éxito la Magna Expo Ganadera y Agrícola en Ciudad Altamirano
Más de 400 productores de Tierra Caliente exhiben sementales de registro y tecnología de riego para la cuenca del Balsas.
Por: Redacción Regional de El Debate
Municipio: Cd. Altamirano (Pungarabato)
Categoría: Campo y Ganadería

Con gran algarabía y asistencia multitudinaria de familias campesinas y criadores de toda la región de Tierra Caliente, dio inicio la edición anual de la Exposición Ganadera y Agrícola en las instalaciones de la asociación ganadera local en Ciudad Altamirano.

El evento reúne a productores de Coyuca de Catalán, Tlapehuala, Cutzamala y Arcelia, quienes presentaron ejemplares bovinos de las razas Suizo Europeo, Brahman y Simbrah adaptados a las altas temperaturas de nuestro valle. Durante el mensaje inaugural se destacó la importancia de tecnificar el riego en las vegas del Río Balsas y apoyar la comercialización directa del ganado en pie.

---

NOTA 2:
Preservan en Tlapehuala la Elaboración Tradicional del Sombrero Calentano de Astilla
Maestros artesanos imparten talleres a nuevas generaciones para evitar que se pierda esta emblemática joya de nuestra identidad cultural.
Por: Corresponsal en Tlapehuala
Municipio: Tlapehuala
Categoría: Cultura y Tradición

En el corazón de Tlapehuala, artesanos sombrereros continúan tejiendo a mano el legendario sombrero de astilla, símbolo indiscutible del orgullo de Tierra Caliente. A través de cooperativas comunitarias, se ha iniciado un programa de rescate para enseñar el trenzado de palma y astilla a jóvenes de la comarca, asegurando que el sombrero calentano siga vistiendo con dignidad a nuestra gente.

---

NOTA 3:
Cutzamala de Pinzón Refuerza Canales de Riego para Proteger Siembra de Ajonjolí y Maíz
Comunidades ribereñas concluyen trabajos de desazolve en compuertas para garantizar agua en la próxima temporada de cosecha.
Por: Mesa Agrícola de El Debate
Municipio: Cutzamala de Pinzón
Categoría: Campo y Ganadería

Campesinos de Cutzamala de Pinzón organizaron faenas comunitarias para rehabilitar los canales secundarios de derivación. Con el respaldo de ejidatarios locales, se garantizará el flujo ordenado de agua para más de 1,200 hectáreas sembradas con maíz blanco y ajonjolí criollo, fortaleciendo el sustento de cientos de familias rurales de la cuenca.
    `;

    setTimeout(() => {
      const result = segmentArticlesFromText(sampleText, [], 'Edicion_El_Debate_Tierra_Caliente.docx');
      setParsedList(result.articles);
      setExtractedPhotosCount(3);
      setStatusLog(prev => [
        ...prev,
        `✓ Se identificaron ${result.articles.length} notas periodísticas.`,
        '★ NOTA PRINCIPAL DEL DÍA DETECTADA: "Inauguran con Éxito la Magna Expo Ganadera y Agrícola en Ciudad Altamirano"',
        'Las notas fueron geolocalizadas en Altamirano, Tlapehuala y Cutzamala.',
        'Documento listo para ser publicado en la portada del diario.'
      ]);
      setIsProcessing(false);
    }, 600);
  };

  const handleProcessPastedText = () => {
    if (!pastedText.trim()) return;
    setIsProcessing(true);
    setFileName('Texto_Pegado_Word.txt');
    const result = segmentArticlesFromText(pastedText, [], 'Texto_Pegado_Word.txt');
    setParsedList(result.articles);
    setShowPasteMode(false);
    setIsProcessing(false);
  };

  // Toggle which article is the Main Headline
  const setAsMainHeadline = (tempId: string) => {
    setParsedList(prev => prev.map(art => ({
      ...art,
      isFeatured: art.tempId === tempId,
      isBreaking: art.tempId === tempId ? true : art.isBreaking
    })));
  };

  // Update specific article field
  const updateParsedField = (tempId: string, field: keyof ParsedWordArticle, value: any) => {
    setParsedList(prev => prev.map(art => {
      if (art.tempId === tempId) {
        return { ...art, [field]: value };
      }
      return art;
    }));
  };

  // Delete article from parsed batch
  const removeParsedArticle = (tempId: string) => {
    setParsedList(prev => {
      const filtered = prev.filter(a => a.tempId !== tempId);
      if (filtered.length > 0 && !filtered.some(a => a.isFeatured)) {
        filtered[0].isFeatured = true;
      }
      return filtered;
    });
  };

  // Publish All to the Live Newspaper
  const handlePublishAll = () => {
    if (parsedList.length === 0) return;

    const result = publishBatchArticles(parsedList, fileName || 'Documento Word');
    setPublishSuccessNotice(
      `¡Se publicaron ${result.publishedCount} notas exitosamente! Nota Principal de Portada: "${result.headlineTitle}". La edición diaria ha quedado registrada en la base de datos.`
    );

    setTimeout(() => {
      setPublishSuccessNotice(null);
      setCurrentTab('portada');
    }, 2800);
  };

  return (
    <div className="space-y-8 py-2">
      {/* Bot Header Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-lg shrink-0 border border-amber-400/40">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-500 text-stone-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                  Bot de Redacción Editorial
                </span>
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" />
                  Base de Datos Diaria Activa
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-headline mt-1 tracking-tight">
                CalentanoBot: Importador de Archivos Word
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-serif max-w-2xl mt-1 leading-relaxed">
                Envía o sube tu documento de Word (.docx) con las notas y fotografías del día. El bot extraerá los textos, identificará la <strong>Nota Principal del Día</strong>, colocará las imágenes y maquetará la edición diaria automáticamente en la base de datos.
              </p>
            </div>
          </div>

          {/* Subtabs switcher */}
          <div className="flex items-center bg-stone-800 p-1.5 rounded-xl border border-stone-700 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setActiveSubTab('bot')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'bot'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Procesador Word (.docx)</span>
            </button>
            <button
              onClick={() => setActiveSubTab('database')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'database'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Base de Datos ({dailyEditions.length} Ediciones)</span>
            </button>
          </div>
        </div>
      </div>

      {publishSuccessNotice && (
        <div className="bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 p-5 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300 shadow-md">
          <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
          <div>
            <div className="font-black text-sm">¡Edición Diaria Publicada Exitosamente!</div>
            <div className="text-xs font-medium text-emerald-800 dark:text-emerald-200 mt-0.5">{publishSuccessNotice}</div>
          </div>
        </div>
      )}

      {activeSubTab === 'bot' ? (
        <div className="space-y-8">
          {/* Document Upload & Action Control Card */}
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-headline text-lg font-black text-stone-950 dark:text-stone-50 flex items-center gap-2 mb-2">
              <Upload className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              <span>1. Cargar Archivo de Word (.docx) o Documento con Notas</span>
            </h3>
            <p className="text-xs text-stone-800 dark:text-stone-200 font-serif leading-relaxed mb-5">
              Puedes subir un archivo generado en Microsoft Word o Google Docs. Si dentro del documento colocas la etiqueta <strong>[NOTA PRINCIPAL]</strong>, <strong>PORTADA</strong> o <strong>TITULAR DEL DÍA</strong>, el bot la posicionará automáticamente al frente de la edición.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* File Input Box */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="md:col-span-2 border-2 border-dashed border-amber-600/60 dark:border-amber-500/40 hover:border-amber-700 bg-amber-50/40 dark:bg-amber-950/20 rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,text/plain"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center group-hover:scale-110 transition duration-300 shadow-xs">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-extrabold text-stone-950 dark:text-stone-100 text-sm">
                    {fileName ? `Archivo seleccionado: ${fileName}` : 'Haz clic para seleccionar tu archivo Word (.docx)'}
                  </div>
                  <div className="text-xs text-stone-700 dark:text-stone-300 font-medium mt-1">
                    Formatos admitidos: .docx, .doc • Extrae automáticamente texto y fotografías
                  </div>
                </div>
              </div>

              {/* Bot Quick Actions */}
              <div className="flex flex-col justify-between space-y-3 bg-stone-50 dark:bg-stone-850 p-4 rounded-xl border border-stone-300 dark:border-stone-700">
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase text-amber-900 dark:text-amber-400 tracking-wider">
                    Asistente de Pruebas
                  </span>
                  <div className="text-xs font-bold text-stone-950 dark:text-stone-100">
                    ¿No tienes un archivo Word a la mano?
                  </div>
                  <p className="text-[11px] text-stone-700 dark:text-stone-300 font-serif">
                    Carga un archivo Word de prueba con notas regionales de Altamirano, Tlapehuala y Cutzamala con su nota principal.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={loadSampleWordDocument}
                    disabled={isProcessing}
                    className="w-full py-2.5 px-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg text-xs cursor-pointer transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Cargar Ejemplo de Word de Hoy</span>
                  </button>

                  <button
                    onClick={() => setShowPasteMode(!showPasteMode)}
                    className="w-full py-2 px-3 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-bold rounded-lg text-xs cursor-pointer transition text-center"
                  >
                    {showPasteMode ? 'Ocultar Cuadro de Pegado' : 'Pegar Texto desde Word'}
                  </button>
                </div>
              </div>
            </div>

            {/* Paste Text Area */}
            {showPasteMode && (
              <div className="mt-5 p-4 bg-stone-50 dark:bg-stone-850 border border-stone-300 dark:border-stone-700 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-stone-950 dark:text-stone-100">
                    Pega el contenido copiado de tu archivo Word:
                  </label>
                  <span className="text-[11px] text-stone-600 dark:text-stone-400">
                    Identifica [NOTA PRINCIPAL] y notas separadas
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Pega aquí el texto de Word. Puedes indicar [NOTA PRINCIPAL] en el encabezado de la nota más importante..."
                  className="w-full p-3 bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-lg text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                />
                <button
                  onClick={handleProcessPastedText}
                  className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer transition flex items-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Procesar Texto con CalentanoBot</span>
                </button>
              </div>
            )}

            {/* Processing Logs & Status */}
            {statusLog.length > 0 && (
              <div className="mt-5 p-4 bg-stone-900 text-stone-200 rounded-xl space-y-1.5 text-xs font-mono border border-stone-800">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-2 font-bold text-amber-400">
                  <span className="flex items-center gap-1.5">
                    <Bot className="w-4 h-4" />
                    Registro de Análisis del Bot:
                  </span>
                  {isProcessing && <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />}
                </div>
                {statusLog.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-stone-500 select-none">›</span>
                    <span className={log.includes('★') ? 'text-amber-300 font-bold' : log.includes('✓') ? 'text-emerald-400 font-bold' : 'text-stone-300'}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Parsed Articles Preview & Customization */}
          {parsedList.length > 0 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-stone-800 dark:border-stone-300 pb-3">
                <div>
                  <h3 className="font-headline text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50 uppercase tracking-tight">
                    2. Notas Periodísticas Procesadas ({parsedList.length})
                  </h3>
                  <p className="text-xs text-stone-800 dark:text-stone-200 font-serif">
                    Verifica la nota principal, ajusta el municipio o fotografías antes de enviar a la portada del diario.
                  </p>
                </div>

                <button
                  onClick={handlePublishAll}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transition shrink-0 animate-bounce-subtle"
                >
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span>Publicar Toda la Edición de Hoy en El Debate</span>
                </button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 gap-6">
                {parsedList.map((art, idx) => (
                  <div
                    key={art.tempId}
                    className={`bg-white dark:bg-stone-900 border-2 rounded-2xl p-5 sm:p-6 transition shadow-sm ${
                      art.isFeatured 
                        ? 'border-amber-500 dark:border-amber-500 ring-2 ring-amber-400/40 bg-linear-to-b from-amber-50/30 to-white dark:from-amber-950/20 dark:to-stone-900' 
                        : 'border-stone-300 dark:border-stone-700'
                    }`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Photo column */}
                      <div className="lg:col-span-4 space-y-3">
                        <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700">
                          {art.imageUrl ? (
                            <img
                              src={art.imageUrl}
                              alt={art.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                              Sin fotografía
                            </div>
                          )}

                          {art.isFeatured && (
                            <div className="absolute top-2 left-2 bg-amber-600 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                              NOTA PRINCIPAL DE PORTADA
                            </div>
                          )}
                        </div>

                        {/* Image URL Input */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-stone-800 dark:text-stone-200">
                            URL de la Fotografía:
                          </label>
                          <input
                            type="text"
                            value={art.imageUrl || ''}
                            onChange={(e) => updateParsedField(art.tempId, 'imageUrl', e.target.value)}
                            className="w-full text-xs p-2 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-mono outline-none"
                            placeholder="https://..."
                          />
                        </div>

                        {/* Caption */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-stone-800 dark:text-stone-200">
                            Pie de Foto:
                          </label>
                          <input
                            type="text"
                            value={art.imageCaption || ''}
                            onChange={(e) => updateParsedField(art.tempId, 'imageCaption', e.target.value)}
                            className="w-full text-xs p-2 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 outline-none"
                            placeholder="Descripción de la imagen..."
                          />
                        </div>
                      </div>

                      {/* Editorial fields column */}
                      <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          {/* Top controls: Headline selector & Municipality */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-2.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => setAsMainHeadline(art.tempId)}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black cursor-pointer transition ${
                                  art.isFeatured
                                    ? 'bg-amber-600 text-white shadow-xs'
                                    : 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-amber-100'
                                }`}
                              >
                                <Star className={`w-3.5 h-3.5 ${art.isFeatured ? 'fill-yellow-300 text-yellow-300' : ''}`} />
                                <span>{art.isFeatured ? '★ NOTA PRINCIPAL (SELECCIONADA)' : 'Hacer Nota Principal del Día'}</span>
                              </button>

                              {art.detectedClues.map((clue, cIdx) => (
                                <span key={cIdx} className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] px-2 py-0.5 rounded font-semibold">
                                  {clue}
                                </span>
                              ))}
                            </div>

                            <button
                              onClick={() => removeParsedArticle(art.tempId)}
                              className="text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 p-1 rounded cursor-pointer transition"
                              title="Eliminar de la edición"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Title */}
                          <div>
                            <label className="text-[11px] font-black uppercase text-stone-700 dark:text-stone-300">
                              Titular de la Nota:
                            </label>
                            <input
                              type="text"
                              value={art.title}
                              onChange={(e) => updateParsedField(art.tempId, 'title', e.target.value)}
                              className="w-full text-base sm:text-lg font-black text-stone-950 dark:text-stone-50 font-headline p-2 rounded-lg bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 focus:border-amber-600 outline-none"
                            />
                          </div>

                          {/* Subtitle */}
                          <div>
                            <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                              Bajada / Subtítulo:
                            </label>
                            <input
                              type="text"
                              value={art.subtitle}
                              onChange={(e) => updateParsedField(art.tempId, 'subtitle', e.target.value)}
                              className="w-full text-xs font-serif text-stone-900 dark:text-stone-100 p-2 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 outline-none"
                            />
                          </div>

                          {/* Municipality & Category dropdowns */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                                Municipio:
                              </label>
                              <select
                                value={art.municipality}
                                onChange={(e) => updateParsedField(art.tempId, 'municipality', e.target.value as RegionMunicipality)}
                                className="w-full p-2 bg-stone-50 dark:bg-stone-800 text-stone-950 dark:text-stone-50 border border-stone-300 dark:border-stone-700 rounded-lg font-semibold"
                              >
                                {municipalities.map(m => (
                                  <option key={m} value={m}>{m}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                                Categoría:
                              </label>
                              <select
                                value={art.category}
                                onChange={(e) => updateParsedField(art.tempId, 'category', e.target.value as ArticleCategory)}
                                className="w-full p-2 bg-stone-50 dark:bg-stone-800 text-stone-950 dark:text-stone-50 border border-stone-300 dark:border-stone-700 rounded-lg font-semibold"
                              >
                                {categories.filter(c => c !== 'Todas').map(c => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                                Autor / Corresponsal:
                              </label>
                              <input
                                type="text"
                                value={art.author}
                                onChange={(e) => updateParsedField(art.tempId, 'author', e.target.value)}
                                className="w-full p-2 bg-stone-50 dark:bg-stone-800 text-stone-950 dark:text-stone-50 border border-stone-300 dark:border-stone-700 rounded-lg font-semibold"
                              />
                            </div>
                          </div>

                          {/* Full Content Preview / Editor */}
                          <div>
                            <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                              Cuerpo de la Nota (Texto Extraído del Word):
                            </label>
                            <textarea
                              rows={4}
                              value={art.content}
                              onChange={(e) => updateParsedField(art.tempId, 'content', e.target.value)}
                              className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-serif text-xs leading-relaxed border border-stone-300 dark:border-stone-700 rounded-lg outline-none"
                            />
                          </div>
                        </div>

                        {/* Footer bar */}
                        <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-700 dark:text-stone-300 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-stone-500" />
                            {art.readingTimeMinutes} min de lectura calculada
                          </span>
                          <span className="text-[11px] text-stone-500">
                            {art.content.split(/\s+/).length} palabras
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Sticky-style Final Publish Button */}
              <div className="p-6 bg-stone-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-stone-800 shadow-xl">
                <div>
                  <h4 className="font-headline font-bold text-base text-amber-400">
                    ¿Todo listo para la edición del día?
                  </h4>
                  <p className="text-xs text-stone-300 font-serif mt-0.5">
                    Al publicar, las {parsedList.length} notas reemplazarán o actualizarán la portada y se guardarán en la base de datos histórica.
                  </p>
                </div>
                <button
                  onClick={handlePublishAll}
                  className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-black px-8 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition"
                >
                  <CheckCircle2 className="w-5 h-5 text-yellow-300" />
                  <span>Publicar en El Debate de los Calentanos</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Database & Archived Editions Tab */
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
              <div>
                <h3 className="font-headline text-xl font-black text-stone-950 dark:text-stone-50 flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                  <span>Base de Datos de Ediciones Diarias</span>
                </h3>
                <p className="text-xs text-stone-800 dark:text-stone-200 font-serif mt-0.5">
                  Registro histórico de ediciones publicadas día con día en Ciudad Altamirano y la región.
                </p>
              </div>

              <button
                onClick={() => createDailyEditionBackup('Respaldo Manual')}
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Archivar Estado Actual de Hoy</span>
              </button>
            </div>

            {/* List of Archived Editions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {dailyEditions.map((ed) => (
                <div
                  key={ed.id}
                  className="bg-stone-50 dark:bg-stone-850 border border-stone-300 dark:border-stone-700 rounded-xl p-4.5 flex flex-col justify-between space-y-3 shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-700 dark:text-stone-300 font-bold mb-1">
                      <span className="flex items-center gap-1 text-amber-900 dark:text-amber-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {ed.dateStr}
                      </span>
                      <span className="bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded text-[11px]">
                        Época II • Núm. {ed.editionNumber}
                      </span>
                    </div>

                    <h4 className="font-headline font-black text-base text-stone-950 dark:text-stone-50 line-clamp-2 mt-1">
                      {ed.headlineArticleTitle}
                    </h4>

                    <div className="text-xs text-stone-700 dark:text-stone-300 mt-2 font-medium">
                      Contiene <strong>{ed.articlesCount} notas</strong> registradas en esta entrega.
                    </div>

                    {ed.sourceDocName && (
                      <div className="text-[11px] text-stone-500 italic mt-1">
                        Origen: {ed.sourceDocName}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        loadEdition(ed.id);
                        setCurrentTab('portada');
                      }}
                      className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Cargar en Portada</span>
                    </button>

                    <span className="text-[10px] text-stone-500">
                      Guardado: {new Date(ed.createdAt).toLocaleDateString('es-MX')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
