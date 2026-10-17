// Dynamic Screen Canvas Texture for Chote Soundbox 3D Mockup

export type ScreenMode = 'multi_cart' | 'qr_code' | 'translation' | 'stock_khata';

export class SoundboxScreen {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public textureNeedsUpdate: boolean = true;
  private currentMode: ScreenMode = 'multi_cart';
  private pulsePhase: number = 0;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1024;
    this.canvas.height = 768;
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D context for screen');
    this.ctx = context;
    this.render();
  }

  public setMode(mode: ScreenMode) {
    this.currentMode = mode;
    this.render();
  }

  public getMode(): ScreenMode {
    return this.currentMode;
  }

  public update(delta: number) {
    this.pulsePhase += delta * 3;
    // Animate subtle live elements (e.g. waveform or pulsing dot)
    this.render();
  }

  private drawHeader(ctx: CanvasRenderingContext2D) {
    // Top Status Bar (Light Mode, Apple Clean style)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 1024, 768);

    // Subtle header gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 100);
    grad.addColorStop(0, '#F8FAFC');
    grad.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 100);

    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.lineTo(1024, 100);
    ctx.stroke();

    // Merchant Store Name
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Gupta Kirana Store', 40, 62);

    // Sarvam Voice Badge (Sarvam Sunrise Saffron)
    const sarvamGrad = ctx.createLinearGradient(410, 32, 614, 32);
    sarvamGrad.addColorStop(0, '#EA580C');
    sarvamGrad.addColorStop(1, '#FF6B35');
    ctx.fillStyle = sarvamGrad;
    ctx.beginPath();
    ctx.roundRect(410, 30, 204, 44, 22);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('● Sarvam AI Live', 512, 59);

    // Clock & Wifi
    ctx.fillStyle = '#64748B';
    ctx.font = '600 24px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('13:10 PM  •  WiFi 5G', 984, 62);
  }

  private drawMultiCart(ctx: CanvasRenderingContext2D) {
    this.drawHeader(ctx);

    // Two customer lanes as described in the spec:
    // "Separate lanes on the display; items go to whoever said them"

    // LANE 1: Ramesh (Regular Customer)
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(36, 126, 460, 480, 24);
    ctx.fill();
    ctx.stroke();

    // Lane 1 Header
    ctx.fillStyle = '#0284C7';
    ctx.beginPath();
    ctx.roundRect(56, 146, 140, 36, 10);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LANE 1 (Active)', 126, 171);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 28px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Ramesh (Voice ID: Match)', 56, 222);

    ctx.fillStyle = '#10B981';
    ctx.font = '600 18px -apple-system, sans-serif';
    ctx.fillText('✓ Regular Customer • Khata: ₹320 pending', 56, 252);

    // Lane 1 Items
    const items1 = [
      { name: '1. Aashirvaad Atta (5kg)', price: '₹225' },
      { name: '2. Fortune Mustard Oil (1L)', price: '₹140' },
      { name: '3. Tata Salt Lite (1kg)', price: '₹28' },
    ];

    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    let y = 290;
    items1.forEach(item => {
      ctx.fillStyle = '#1E293B';
      ctx.font = '500 22px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.name, 56, y);

      ctx.font = 'bold 22px -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(item.price, 460, y);

      ctx.beginPath();
      ctx.moveTo(56, y + 16);
      ctx.lineTo(460, y + 16);
      ctx.stroke();
      y += 50;
    });

    // Lane 1 Total
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 28px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Total:', 56, 560);
    ctx.fillStyle = '#0284C7';
    ctx.font = 'bold 36px -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('₹393', 460, 560);

    // LANE 2: Walk-in Customer (Kannada speaker)
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(528, 126, 460, 480, 24);
    ctx.fill();
    ctx.stroke();

    // Lane 2 Header
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.roundRect(548, 146, 160, 36, 10);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LANE 2 (Parked)', 628, 171);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 28px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Customer B (Kannada)', 548, 222);

    ctx.fillStyle = '#64748B';
    ctx.font = '600 18px -apple-system, sans-serif';
    ctx.fillText('Auto-detected Kannada • Pehle isko (Parked)', 548, 252);

    const items2 = [
      { name: '1. Nandini Milk (500ml)', price: '₹24' },
      { name: '2. Parle-G Gold (Large)', price: '₹30' },
    ];

    y = 290;
    items2.forEach(item => {
      ctx.fillStyle = '#1E293B';
      ctx.font = '500 22px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.name, 548, y);

      ctx.font = 'bold 22px -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(item.price, 952, y);

      ctx.beginPath();
      ctx.moveTo(548, y + 16);
      ctx.lineTo(952, y + 16);
      ctx.stroke();
      y += 50;
    });

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 28px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Total:', 548, 560);
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 36px -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('₹54', 952, 560);

    // Bottom Voice Activity Prompt Bar
    this.drawBottomVoiceBar(ctx, '🎙️ Ambient: "Chote, Ramesh ke khate me daal do ya QR nikalo"');
  }

  private drawQRCode(ctx: CanvasRenderingContext2D) {
    this.drawHeader(ctx);

    // Big Apple/Paytm style UPI Payment Card
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(140, 126, 744, 490, 28);
    ctx.fill();
    ctx.stroke();

    // Amount Display
    ctx.fillStyle = '#64748B';
    ctx.font = '600 24px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN & PAY UPI • BHIM / PAYTM / GPAY / PHONEPE', 512, 175);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 64px -apple-system, sans-serif';
    ctx.fillText('₹ 393.00', 512, 248);

    // QR Code Container Box
    const qrSize = 210;
    const qrX = 512 - qrSize / 2;
    const qrY = 275;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

    // Procedural QR Pattern
    this.drawProceduralQR(ctx, qrX, qrY, qrSize);

    // UPI ID tag
    ctx.fillStyle = '#0284C7';
    ctx.font = '600 20px monospace';
    ctx.fillText('UPI ID: guptakirana@okaxis', 512, 526);

    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 20px -apple-system, sans-serif';
    ctx.fillText('✓ Voice Verified: "QR bolte hi instant soundbox payment display"', 512, 565);

    this.drawBottomVoiceBar(ctx, '🔊 Soundbox: "Ramesh ji, ₹393 ka QR screen pe aa gaya hai"');
  }

  private drawProceduralQR(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    const modules = 21;
    const modSize = size / modules;
    ctx.fillStyle = '#0F172A';

    // Corner Finder Patterns
    const drawFinder = (fx: number, fy: number) => {
      ctx.fillRect(x + fx * modSize, y + fy * modSize, 7 * modSize, 7 * modSize);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x + (fx + 1) * modSize, y + (fy + 1) * modSize, 5 * modSize, 5 * modSize);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(x + (fx + 2) * modSize, y + (fy + 2) * modSize, 3 * modSize, 3 * modSize);
    };

    drawFinder(0, 0);
    drawFinder(modules - 7, 0);
    drawFinder(0, modules - 7);

    // Random consistent data dots
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        // Skip finder areas
        if ((r < 8 && c < 8) || (r < 8 && c > modules - 9) || (r > modules - 9 && c < 8)) continue;
        if ((r * 13 + c * 7 + (r ^ c)) % 3 === 0) {
          ctx.fillRect(x + c * modSize, y + r * modSize, modSize, modSize);
        }
      }
    }
  }

  private drawTranslation(ctx: CanvasRenderingContext2D) {
    this.drawHeader(ctx);

    // Sarvam Multilingual Speech Translation Screen
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(80, 126, 864, 490, 26);
    ctx.fill();
    ctx.stroke();

    // Translation Header Banner
    ctx.fillStyle = '#EEF2FF';
    ctx.beginPath();
    ctx.roundRect(110, 150, 804, 60, 16);
    ctx.fill();

    ctx.fillStyle = '#4F46E5';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Sarvam AI Real-Time Cross-Language Translation (Zero Dead Air)', 512, 188);

    // Kannada Customer Utterance
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(120, 230, 784, 150, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#EA580C';
    ctx.font = 'bold 20px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🗣️ Customer (Kannada Voice Input):', 145, 270);

    ctx.fillStyle = '#0F172A';
    ctx.font = '28px -apple-system, sans-serif';
    ctx.fillText('“ಒಳ್ಳೆಯ ತೊಗರಿ ಬೇಳೆ ಇದೆಯಾ? ಒಂದು ಕೆಜಿ ಬೆಲೆ ಎಷ್ಟು?”', 145, 320);

    ctx.fillStyle = '#64748B';
    ctx.font = 'italic 18px -apple-system, sans-serif';
    ctx.fillText('(Olleya togari bele ideya? Ondu kg bele eshtu?)', 145, 355);

    // Hindi Auto-Translation for Kirana Owner
    ctx.fillStyle = '#F0FDF4';
    ctx.strokeStyle = '#86EFAC';
    ctx.beginPath();
    ctx.roundRect(120, 400, 784, 140, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#15803D';
    ctx.font = 'bold 20px -apple-system, sans-serif';
    ctx.fillText('🇮🇳 Owner Audio & Text (Hindi Output):', 145, 438);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 28px -apple-system, sans-serif';
    ctx.fillText('“बढ़िया अरहर दाल है क्या? एक किलो का भाव कितना है?”', 145, 488);

    ctx.fillStyle = '#16A34A';
    ctx.font = '600 18px -apple-system, sans-serif';
    ctx.fillText('⚡ Latency: 1.4s • Talker Agent translating concurrently without blocking bill', 145, 520);

    this.drawBottomVoiceBar(ctx, '🌐 Chote: "Customer asks for 1kg Toor Dal quality and price"');
  }

  private drawStockKhata(ctx: CanvasRenderingContext2D) {
    this.drawHeader(ctx);

    // Kirana Khata & Stock Intelligence View
    // Left Card: Ramesh's Khata (Ledger)
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(40, 126, 460, 490, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 26px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('📖 Ramesh Ji Khata Ledger', 64, 175);

    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 38px -apple-system, sans-serif';
    ctx.fillText('₹ 320.00 Udhaar', 64, 230);

    ctx.fillStyle = '#64748B';
    ctx.font = '500 18px -apple-system, sans-serif';
    ctx.fillText('Repayment Trust Score: 94/100 (High Trust)', 64, 268);

    const khataHistory = [
      { date: 'Yesterday', desc: 'Aata & Maggi on Credit', amt: '+ ₹180' },
      { date: '14 Oct', desc: 'Google Pay Repayment', amt: '- ₹500' },
      { date: '12 Oct', desc: 'Sugar 2kg & Tea', amt: '+ ₹140' },
    ];

    let ky = 310;
    khataHistory.forEach(h => {
      ctx.fillStyle = '#334155';
      ctx.font = '600 18px -apple-system, sans-serif';
      ctx.fillText(h.date, 64, ky);
      ctx.font = '500 18px -apple-system, sans-serif';
      ctx.fillText(h.desc, 160, ky);
      ctx.fillStyle = h.amt.includes('+') ? '#DC2626' : '#16A34A';
      ctx.font = 'bold 18px -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(h.amt, 470, ky);
      ctx.textAlign = 'left';
      ky += 42;
    });

    // Right Card: Kirana Stock Auto-Decrement & Alerts
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(524, 126, 460, 490, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 26px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('📦 Smart Stock & Inventory', 548, 175);

    const stockItems = [
      { name: 'Basmati Rice (Kolam)', qty: '3 kg left', status: 'LOW STOCK ⚠️', color: '#DC2626' },
      { name: 'Fortune Sunflower Oil', qty: '18 packets', status: 'IN STOCK', color: '#16A34A' },
      { name: 'Tata Salt Crystals', qty: '42 packets', status: 'IN STOCK', color: '#16A34A' },
      { name: 'Madhur Pure Sugar', qty: '12 kg', status: 'NORMAL', color: '#0284C7' },
    ];

    let sy = 230;
    stockItems.forEach(s => {
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 19px -apple-system, sans-serif';
      ctx.fillText(s.name, 548, sy);

      ctx.fillStyle = '#64748B';
      ctx.font = '500 17px -apple-system, sans-serif';
      ctx.fillText(s.qty, 548, sy + 25);

      ctx.fillStyle = s.color;
      ctx.font = 'bold 16px -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(s.status, 954, sy + 15);
      ctx.textAlign = 'left';

      ctx.strokeStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.moveTo(548, sy + 38);
      ctx.lineTo(954, sy + 38);
      ctx.stroke();
      sy += 65;
    });

    this.drawBottomVoiceBar(ctx, '🗣️ Voice Action: "Chote, rice 10 kilo aaya" auto-increments stock');
  }

  private drawBottomVoiceBar(ctx: CanvasRenderingContext2D, text: string) {
    // Bottom Voice Transcript & Agent Status Ribbon
    ctx.fillStyle = '#F1F5F9';
    ctx.beginPath();
    ctx.roundRect(36, 630, 952, 100, 20);
    ctx.fill();

    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Pulsing mic wave icon (Sarvam Saffron + Paytm Cyan)
    const waveSin = Math.sin(this.pulsePhase) * 6;
    ctx.fillStyle = '#FF6B35';
    ctx.beginPath();
    ctx.arc(80, 680, 18, 0, Math.PI * 2);
    ctx.fill();

    // Wave ring (Paytm Cyan)
    ctx.strokeStyle = '#00BAF2';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(80, 680, 22 + Math.abs(waveSin), 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎙', 80, 687);

    // Text info
    ctx.fillStyle = '#0F172A';
    ctx.font = '600 22px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(text, 125, 688);
  }

  private render() {
    switch (this.currentMode) {
      case 'multi_cart':
        this.drawMultiCart(this.ctx);
        break;
      case 'qr_code':
        this.drawQRCode(this.ctx);
        break;
      case 'translation':
        this.drawTranslation(this.ctx);
        break;
      case 'stock_khata':
        this.drawStockKhata(this.ctx);
        break;
    }
    this.textureNeedsUpdate = true;
  }
}
