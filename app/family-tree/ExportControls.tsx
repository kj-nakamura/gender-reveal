"use client";

import { useState, memo } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportControlsProps {
  treeName: string;
}

function ExportControls({ treeName }: ExportControlsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string>('');

  const exportToPNG = async () => {
    setIsExporting(true);
    setExportStatus('PNG画像を作成中...');

    try {
      // React Flowのキャンバス要素を取得
      const flowElement = document.querySelector('.react-flow') as HTMLElement;
      
      if (!flowElement) {
        throw new Error('家系図が見つかりません');
      }

      // キャンバスに変換
      const canvas = await html2canvas(flowElement, {
        background: '#ffffff',
        useCORS: true,
        allowTaint: true,
        height: flowElement.scrollHeight,
        width: flowElement.scrollWidth,
      });

      // ダウンロード
      const link = document.createElement('a');
      link.download = `${treeName}_家系図.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setExportStatus('PNG画像のダウンロードが完了しました');
    } catch (error) {
      console.error('PNG export error:', error);
      setExportStatus('PNG画像の作成に失敗しました');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  const exportToJPEG = async () => {
    setIsExporting(true);
    setExportStatus('JPEG画像を作成中...');

    try {
      const flowElement = document.querySelector('.react-flow') as HTMLElement;
      
      if (!flowElement) {
        throw new Error('家系図が見つかりません');
      }

      const canvas = await html2canvas(flowElement, {
        background: '#ffffff',
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.download = `${treeName}_家系図.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();

      setExportStatus('JPEG画像のダウンロードが完了しました');
    } catch (error) {
      console.error('JPEG export error:', error);
      setExportStatus('JPEG画像の作成に失敗しました');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    setExportStatus('PDF文書を作成中...');

    try {
      const flowElement = document.querySelector('.react-flow') as HTMLElement;
      
      if (!flowElement) {
        throw new Error('家系図が見つかりません');
      }

      const canvas = await html2canvas(flowElement, {
        background: '#ffffff',
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      
      // PDF作成
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // 画像のアスペクト比を保持しながらPDFに収める
      const imgAspectRatio = canvas.width / canvas.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;
      
      let imgWidth, imgHeight;
      if (imgAspectRatio > pdfAspectRatio) {
        imgWidth = pdfWidth;
        imgHeight = pdfWidth / imgAspectRatio;
      } else {
        imgHeight = pdfHeight;
        imgWidth = pdfHeight * imgAspectRatio;
      }

      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      // タイトルを追加
      pdf.setFontSize(16);
      pdf.text(treeName, 10, 10);
      
      // 作成日を追加
      pdf.setFontSize(10);
      const today = new Date().toLocaleDateString('ja-JP');
      pdf.text(`作成日: ${today}`, 10, 20);

      pdf.save(`${treeName}_家系図.pdf`);

      setExportStatus('PDF文書のダウンロードが完了しました');
    } catch (error) {
      console.error('PDF export error:', error);
      setExportStatus('PDF文書の作成に失敗しました');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">家系図をエクスポート</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <button
          onClick={exportToPNG}
          disabled={isExporting}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
        >
          📸 PNG画像
        </button>
        
        <button
          onClick={exportToJPEG}
          disabled={isExporting}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
        >
          🖼️ JPEG画像
        </button>
        
        <button
          onClick={exportToPDF}
          disabled={isExporting}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
        >
          📄 PDF文書
        </button>
      </div>

      {exportStatus && (
        <div className={`p-3 rounded-md text-sm ${
          exportStatus.includes('失敗') || exportStatus.includes('エラー')
            ? 'bg-red-100 text-red-700'
            : exportStatus.includes('完了')
            ? 'bg-green-100 text-green-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {exportStatus}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>💡 エクスポートのヒント:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>PNG: 透明背景対応、高品質</li>
          <li>JPEG: ファイルサイズが小さい</li>
          <li>PDF: 印刷やドキュメント保存に最適</li>
        </ul>
      </div>
    </div>
  );
}

export default memo(ExportControls);