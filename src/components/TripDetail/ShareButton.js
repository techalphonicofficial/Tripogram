"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShareFromSquare, 
  faLink, 
  faCopy, 
  faCheck, 
  faQrcode, 
  faXmark,
  faShareNodes,
  faEnvelope,
  faUser,
  faRobot,
  faMobileScreen,
  faEnvelopeOpenText
} from '@fortawesome/free-solid-svg-icons';
import { 
  faWhatsapp, 
  faFacebook, 
  faTwitter, 
  faLinkedin, 
  faTelegram,
  faMicrosoft
} from '@fortawesome/free-brands-svg-icons';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';

const ShareButton = ({ packageLink, packageName = "Package", packageImage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Generate full absolute URL (important for HTTP/IP testing)
  const [fullUrl, setFullUrl] = useState(packageLink || "");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = packageLink?.startsWith('http') 
        ? packageLink 
        : `${window.location.origin}/${packageLink}`;
      setFullUrl(url);
    }
  }, [packageLink]);

  const shareOptions = [
    { title: 'WhatsApp', icon: faWhatsapp, color: '#25D366', url: `https://wa.me/?text=${encodeURIComponent(packageName + ": " + fullUrl)}` },
    { title: 'Facebook', icon: faFacebook, color: '#1877F2', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}` },
    { title: 'Twitter', icon: faTwitter, color: '#000', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(packageName)}` },
    { title: 'LinkedIn', icon: faLinkedin, color: '#0A66C2', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}` },
    { title: 'Telegram', icon: faTelegram, color: '#26A5E4', url: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(packageName)}` },
    { title: 'Gmail', icon: faEnvelope, color: '#EA4335', url: `mailto:?subject=${encodeURIComponent(packageName)}&body=${encodeURIComponent(fullUrl)}` },
    { title: 'Teams', icon: faMicrosoft, color: '#6264A7', url: `https://teams.microsoft.com/l/chat/0/0?users=&message=${encodeURIComponent(packageName + ": " + fullUrl)}` },
    { title: 'Outlook', icon: faEnvelopeOpenText, color: '#0078d4', url: `mailto:?subject=${encodeURIComponent(packageName)}&body=${encodeURIComponent(fullUrl)}` },
  ];

  // Robust Copy Logic (Works on HTTP/IP correctly)
  const handleCopy = () => {
    try {
      const el = document.createElement('textarea');
      el.value = fullUrl;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const toggleModal = () => setIsOpen(!isOpen);

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <div className="share-container position-relative">
      {/* Trigger Button */}
      <button
        className="share_btn d-flex align-items-center gap-2 bg-white px-4 py-1 transition hover:bg-light border rounded"
        onClick={toggleModal}
        style={{ borderColor: '#0598cc', color: '#0598cc', fontWeight: '500', minHeight: '38px', borderRadius: '4px' }}
      >
        <FontAwesomeIcon icon={faShareFromSquare} />
        <span>Share</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="share-modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '15px'
          }}
          onClick={toggleModal}
        >
          {/* Modal Box */}
          <div 
            className="share-modal-content scale-in"
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#f3f4f6',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
              border: '1px solid #fff',
              maxHeight: '95vh',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faShareFromSquare} className="text-secondary" />
                <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>Share link</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="bg-white p-1 rounded-circle border shadow-sm d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                  <FontAwesomeIcon icon={faUser} size="xs" className="text-secondary" />
                </div>
                <button onClick={toggleModal} className="btn btn-link p-1 text-secondary text-decoration-none">
                  <FontAwesomeIcon icon={faXmark} size="lg" />
                </button>
              </div>
            </div>

            {/* Scroll Area */}
            <div className="p-1 overflow-auto" style={{ scrollbarWidth: 'thin' }}>
              {/* Preview Card */}
              <div className="p-3">
                <div className="bg-white p-3 rounded-4 border d-flex align-items-center gap-3 shadow-sm">
                  <div className="flex-shrink-0" style={{ width: '60px', height: '60px', position: 'relative',margin:'8px' }}>
                    <Image 
                      src={packageImage || '/tripogramLogo.png'} 
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-3 shadow-sm"
                      alt="Banner"
                    />
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <h6 className="mb-0 text-dark fw-bold text-truncate" style={{ fontSize: '14px' }}>{packageName}</h6>
                    <p className="mb-0 text-secondary small text-truncate opacity-75">{fullUrl}</p>
                  </div>
                  <div className="d-flex gap-2">
                    <button 
                      onClick={() => setShowQR(!showQR)}
                      className={`btn ${showQR ? 'btn-primary text-white' : 'btn-light'} rounded-circle shadow-sm border p-0 d-flex align-items-center justify-content-center`} 
                      style={{ width: '36px', height: '36px', transition: '0.3s' }}
                    >
                      <FontAwesomeIcon icon={faQrcode} />
                    </button>
                    <button 
                      onClick={handleCopy}
                      className={`btn ${copySuccess ? 'btn-primary' : 'btn-light'} border rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center`} 
                      style={{ width: '36px', height: '36px', transition: '0.3s' }}
                    >
                      <FontAwesomeIcon icon={copySuccess ? faCheck : faCopy} className={copySuccess ? 'text-white' : 'text-secondary'} />
                    </button>
                  </div>
                </div>

                {/* QR Display */}
                {showQR && (
                  <div className="mt-3 bg-white p-4 rounded-4 border text-center animate-fade-in shadow-inner d-flex flex-column align-items-center gap-3">
                    <span className="fw-bold small text-dark">Scan QR code to view package</span>
                    <div className="bg-white p-2 rounded-3 border shadow-sm" style={{ width: 'fit-content' }}>
                       <QRCodeSVG value={fullUrl} size={160} level="M" />
                    </div>
                    <p className="small text-muted mb-0">Testing on {fullUrl}</p>
                  </div>
                )}
              </div>

              {/* Grid Section */}
              <div className="px-4 py-2">
                <h6 className="small text-muted opacity-50 mb-3">Share using</h6>
                <div className="row g-3 g-md-4 mb-4">
                  {shareOptions.map((opt, i) => (
                    <div key={i} className="col-3 text-center">
                      <a 
                        href={opt.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-decoration-none d-flex flex-column align-items-center gap-1 group"
                      >
                        <div 
                          className="bg-white rounded-circle shadow-sm border d-flex align-items-center justify-content-center transition-all hover-scale" 
                          style={{ width: '48px', height: '48px' }}
                        >
                          <FontAwesomeIcon icon={opt.icon} style={{ color: opt.color, fontSize: '22px' }} />
                        </div>
                        <span className="text-dark small text-truncate w-100 mt-1" style={{ fontSize: '10px', fontWeight: '500' }}>{opt.title}</span>
                      </a>
                    </div>
                  ))}
                  {/* Nearby Sharing logic if native share is false anyway */}
                  {typeof navigator !== 'undefined' && navigator.share && (
                    <div className="col-3 text-center">
                      <div 
                        onClick={() => navigator.share({ title: packageName, url: fullUrl })}
                        className="cursor-pointer d-flex flex-column align-items-center gap-1"
                      >
                        <div className="bg-white rounded-circle shadow-sm border d-flex align-items-center justify-content-center hover-scale" style={{ width: '48px', height: '48px' }}>
                          <FontAwesomeIcon icon={faShareNodes} style={{ color: '#0078d4', fontSize: '22px' }} />
                        </div>
                        <span className="text-dark small text-truncate w-100 mt-1" style={{ fontSize: '10px', fontWeight: '500' }}>Native</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .scale-in {
          animation: scaleIn 0.2s ease-out forwards;
        }
        .hover-scale:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
};

export default ShareButton;
