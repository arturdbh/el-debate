import { jsPDF } from 'jspdf';
import { Article, ReadingStats } from '../types/newspaper';

export function exportArticleToPDF(article: Article): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Header Bar
  doc.setFillColor(180, 83, 9); // Amber-700
  doc.rect(margin, 12, contentWidth, 2, 'F');

  // Newspaper Masthead
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 20, 10);
  doc.text('EL DEBATE DE LOS CALENTANOS', pageWidth / 2, 22, { align: 'center' });

  // Subtitle / Regional slogan
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(110, 100, 90);
  doc.text('LA VOZ INDEPENDIENTE DE CIUDAD ALTAMIRANO Y LA TIERRA CALIENTE', pageWidth / 2, 27, { align: 'center' });

  // Divider line
  doc.setDrawColor(200, 190, 180);
  doc.line(margin, 31, pageWidth - margin, 31);

  // Meta line: Municipality & Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text(`SECCIÓN: ${article.category.toUpperCase()} | MUNICIPIO: ${article.municipality.toUpperCase()}`, margin, 36);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Fecha: ${article.publishedAt} | Lectura est.: ${article.readingTimeMinutes} min`, pageWidth - margin, 36, { align: 'right' });

  // Headline
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(20, 20, 20);
  const titleLines = doc.splitTextToSize(article.title, contentWidth);
  let currentY = 44;
  doc.text(titleLines, margin, currentY);
  currentY += titleLines.length * 7;

  // Subtitle
  if (article.subtitle) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10.5);
    doc.setTextColor(80, 80, 80);
    const subLines = doc.splitTextToSize(article.subtitle, contentWidth);
    doc.text(subLines, margin, currentY);
    currentY += subLines.length * 5 + 4;
  }

  // Author byline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.text(`Por: ${article.author} (${article.authorRole})`, margin, currentY);
  currentY += 6;

  // Key summary box
  doc.setFillColor(248, 246, 240);
  doc.setDrawColor(220, 210, 195);
  const summaryLines = doc.splitTextToSize(`SÍNTESIS REGIONAL: ${article.summary}`, contentWidth - 8);
  const summaryBoxHeight = summaryLines.length * 4.5 + 6;
  doc.roundedRect(margin, currentY, contentWidth, summaryBoxHeight, 2, 2, 'FD');

  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(45, 40, 35);
  doc.text(summaryLines, margin + 4, currentY + 5);
  currentY += summaryBoxHeight + 8;

  // Article Content
  doc.setFont('times', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 30, 30);
  const paragraphs = article.content.split('\n\n');
  
  for (const para of paragraphs) {
    if (!para.trim()) continue;
    const pLines = doc.splitTextToSize(para.trim(), contentWidth);
    
    // Check if we need page break
    if (currentY + pLines.length * 5.2 > 275) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.text(pLines, margin, currentY);
    currentY += pLines.length * 5.2 + 4;
  }

  // Footer
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 210, 200);
    doc.line(margin, 285, pageWidth - margin, 285);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 130, 120);
    doc.text('El Debate de los Calentanos — Edición Digital Comunitaria. Ciudad Altamirano, Guerrero, México.', margin, 290);
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, 290, { align: 'right' });
  }

  const safeFilename = article.title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .slice(0, 30);
  doc.save(`debate-calentano-${safeFilename}.pdf`);
}

export function exportUserStatsReportPDF(
  stats: ReadingStats,
  articles: Article[],
  userName: string = 'Lector Calentano'
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Header
  doc.setFillColor(180, 83, 9);
  doc.rect(margin, 15, contentWidth, 2, 'F');

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(30, 20, 10);
  doc.text('EL DEBATE DE LOS CALENTANOS', pageWidth / 2, 26, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Reporte Personal de Lectura Comunitaria e Intereses Regionales', pageWidth / 2, 32, { align: 'center' });

  doc.setDrawColor(200, 190, 180);
  doc.line(margin, 37, pageWidth - margin, 37);

  // User Card Info
  let currentY = 46;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text(`Perfil del Lector: ${userName}`, margin, currentY);

  currentY += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(70, 70, 70);
  doc.text(`Fecha del reporte: ${new Date().toLocaleDateString('es-MX', { dateStyle: 'full' })}`, margin, currentY);

  // Metrics Grid Boxes
  currentY += 12;
  const boxW = (contentWidth - 6) / 3;
  const boxH = 22;

  // Box 1: Artículos leídos
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(margin, currentY, boxW, boxH, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(180, 83, 9);
  doc.text(String(stats.articlesRead.length), margin + boxW / 2, currentY + 10, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(80, 70, 60);
  doc.text('Artículos Leídos', margin + boxW / 2, currentY + 17, { align: 'center' });

  // Box 2: Minutos de lectura
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(margin + boxW + 3, currentY, boxW, boxH, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(5, 150, 105);
  doc.text(`${stats.totalMinutesRead} min`, margin + boxW + 3 + boxW / 2, currentY + 10, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(80, 70, 60);
  doc.text('Tiempo Dedicado', margin + boxW + 3 + boxW / 2, currentY + 17, { align: 'center' });

  // Box 3: Racha de lectura
  doc.setFillColor(254, 226, 226);
  doc.roundedRect(margin + (boxW + 3) * 2, currentY, boxW, boxH, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 38);
  doc.text(`${stats.readingStreakDays} días`, margin + (boxW + 3) * 2 + boxW / 2, currentY + 10, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(80, 70, 60);
  doc.text('Racha Consecutiva', margin + (boxW + 3) * 2 + boxW / 2, currentY + 17, { align: 'center' });

  // Intereses por categoría
  currentY += boxH + 12;
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 20, 10);
  doc.text('Distribución de Temas de Interés Regional:', margin, currentY);

  currentY += 7;
  const categories = Object.entries(stats.favoriteCategories);
  if (categories.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(120, 120, 120);
    doc.text('Aún no has leído suficientes artículos para calcular tus categorías favoritas.', margin, currentY);
    currentY += 10;
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    for (const [cat, count] of categories) {
      doc.setTextColor(50, 50, 50);
      doc.text(`• ${cat}: ${count} artículos leídos`, margin + 4, currentY);
      currentY += 6;
    }
    currentY += 4;
  }

  // Lista de últimos artículos leídos
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 20, 10);
  doc.text('Historial Reciente de Artículos Consultados:', margin, currentY);
  currentY += 7;

  const readArticles = articles.filter(a => stats.articlesRead.includes(a.id));
  if (readArticles.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(120, 120, 120);
    doc.text('Comienza a leer noticias para generar tu historial.', margin, currentY);
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    for (const art of readArticles.slice(0, 6)) {
      const artLine = `• [${art.municipality}] ${art.title} (${art.publishedAt})`;
      const wrapped = doc.splitTextToSize(artLine, contentWidth - 4);
      doc.setTextColor(60, 60, 60);
      doc.text(wrapped, margin + 2, currentY);
      currentY += wrapped.length * 4.5 + 2;
    }
  }

  // Footer
  doc.setDrawColor(220, 210, 200);
  doc.line(margin, 280, pageWidth - margin, 280);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(140, 130, 120);
  doc.text('Generado por El Debate de los Calentanos — Fortaleciendo la identidad de Tierra Caliente.', margin, 285);

  doc.save('debate-calentano-reporte-lectura.pdf');
}
