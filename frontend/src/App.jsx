import { useState, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import './App.css';

// 1. IMPORT YOUR NEW COMPONENTS
import ReportResults from './components/ReportResults';
import SystemAnalytics from './components/SystemAnalytics';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [translatedReport, setTranslatedReport] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setReportData(null);
    setTranslatedReport(null);

    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      const response = await fetch('http://localhost:3001/api/health/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setReportData(data);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload Error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const messageToSend = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: messageToSend }]);
    setChatLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/health/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend }),
      });
      const data = await response.json();
      if (response.ok) {
        const botReply = data.reply?.answer || data.reply;
        setChatHistory(prev => [...prev, { role: 'bot', content: botReply }]);
      }
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'bot', content: 'Server Error.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const originalElement = document.getElementById('report-content');
    const container = document.createElement('div');
    const clonedElement = originalElement.cloneNode(true);
    container.appendChild(clonedElement);
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#000000';
    container.style.padding = '40px';

    const allChildren = container.querySelectorAll('*');
    allChildren.forEach(child => {
      child.style.color = '#000000';
      child.style.textShadow = 'none';
    });

    const opt = {
      margin: 0.5,
      filename: 'Medical_Analysis.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(container).save();
  };

  const handleTranslate = async (e) => {
    const targetLang = e.target.value;
    if (targetLang === "en") {
      setTranslatedReport(null);
      return;
    }
    setIsTranslating(true);
    const textToTranslate = `Translate strictly into ${targetLang}. Summary: ${reportData.data.summary}. Recommendations: ${reportData.data.recommendations.join(', ')}`;

    try {
      const response = await fetch('http://localhost:3001/api/health/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToTranslate }),
      });
      const data = await response.json();
      if (response.ok) {
        setTranslatedReport(data.reply?.answer || data.reply);
      }
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="app-container" style={{ backgroundColor: '#030712', minHeight: '100vh' }}>
      <header className="header">
        <h1>Health Dashboard</h1>
        <p>AI-Powered Medical Report Analysis</p>
      </header>

      {/* UPLOAD SECTION */}
      <section className="section glass-panel upload-container">
        <h2>Upload Report</h2>
        <div className="file-input-wrapper">
          <input type="file" accept=".pdf,image/*" onChange={handleFileChange} disabled={uploading} />
        </div>
        <button onClick={handleUpload} disabled={!selectedFile || uploading}>
          {uploading ? 'Analyzing...' : 'Analyze Report'}
        </button>
      </section>

      {/* RESULTS SECTION - INTEGRATED WITH NEW UI */}
      {reportData && reportData.data && (
        <div id="report-content">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '20px' }}>
            <select onChange={handleTranslate} className="glass-panel" style={{ color: 'white', padding: '10px' }}>
              <option value="en">🇺🇸 English</option>
              <option value="Hindi">🇮🇳 Hindi</option>
              <option value="Tamil">🇮🇳 Tamil</option>
              <option value="Spanish">🇪🇸 Spanish</option>
            </select>
            <button onClick={handleDownloadPDF} style={{ backgroundColor: '#4ade80', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' }}>
              Download PDF
            </button>
          </div>

          {/* This component shows the Summary, Recs, and Questions */}
          <ReportResults resultData={translatedReport ? { summary: translatedReport, recommendations: [], suggestedQuestions: [] } : reportData.data} />
        </div>
      )}

      {/* CHAT SECTION */}
      <section className="section glass-panel chat-container">
        <div className="chat-history">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>{msg.content}</div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form className="chat-input-area" onSubmit={handleSendMessage}>
          <input type="text" placeholder="Ask questions..." value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} />
          <button type="submit">Send</button>
        </form>
      </section>

      {/* 2. SYSTEM ANALYTICS SECTION (AT THE BOTTOM FOR OPTION B) */}
      {reportData && (
        <SystemAnalytics similarityScore={reportData.confidence} />
      )}
    </div>
  );
}

export default App;