import { useState, useEffect } from 'react';
import { 
  Heart, Calendar, MapPin, Sparkles, ChevronDown, 
  Compass, ArrowUp, Milestone, MessageSquareHeart
} from 'lucide-react';

// Import subcomponents
import GroomBrideIntro from './components/GroomBrideIntro';
import CountdownRSVP from './components/CountdownRSVP';
import PhotoAlbum from './components/PhotoAlbum';
import ShareInvitation from './components/ShareInvitation';
import GuestManager from './components/GuestManager';
import MusicPlayer from './components/MusicPlayer';
import LiveSchedule from './components/LiveSchedule';
import { WeddingCoupleInfo } from './types';

export default function App() {
  const [invitedGuest, setInvitedGuest] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentPage, setCurrentPage] = useState<'invitation' | 'schedule'>('invitation');

  // Parse custom invitee parameter '?to=name'
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get('to');
    if (toParam) {
      setInvitedGuest(toParam);
    }

    // Scroll top monitor
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);

    // Hash routing listener
    const handleHashChange = () => {
      if (window.location.hash === '#schedule') {
        setCurrentPage('schedule');
        window.scrollTo({ top: 0 });
      } else {
        setCurrentPage('invitation');
      }
    };
    handleHashChange(); // Run once at load
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Pre-configured couple bios
  const groomInfo: WeddingCoupleInfo = {
    name: "Võ Lê Nguyên",
    shortName: "Lê Nguyên",
    avatar: "Groom.jpg",
    father: "",
    mother: "",
    birthdate: "2002 - Quê Quảng Ngãi",
    description: "Đi qua những con đường gập ghềnh sỏi đá, sẽ luôn có một biển hoa đợi bạn ở phía trước!!",
    bankName: "Ngân hàng Thương mại Cổ phần Ngoại thương Việt Nam (Vietcombank)",
    bankAccount: "1133668899",
    bankBranch: "Chi nhánh Hà Nội",
    qrCodeUrl: "https://api.vietqr.io/image/970436-1133668899-qr_only.png?accountName=DOAN%2520TRUONG%252520XUAN&amount=1000000"
  };

  const brideInfo: WeddingCoupleInfo = {
    name: "Trịnh Thị Thanh Như",
    shortName: "Thanh Như",
    avatar: "Bride.jpg",
    father: "",
    mother: "",
    birthdate: "2001 - Quê Bình Dương",
    description: "Sống chill một chút, trời thương một chút 🥰",
    bankName: "Ngân hàng Cổ phần Quân đội (MB bank)",
    bankAccount: "9988776655",
    bankBranch: "Chi nhánh Đà Nẵng",
    qrCodeUrl: "https://api.vietqr.io/image/970422-9988776655-qr_only.png?accountName=CO%2520DAU&amount=1000000"
  };

  const weddingDateTimestamp = new Date("2026-07-01T11:00:00").getTime();

  if (currentPage === 'schedule') {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-800 font-sans relative selection:bg-amber-100 selection:text-rose-950">
        <MusicPlayer />
        <LiveSchedule onBackToInvitation={() => { window.location.hash = ''; }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans relative selection:bg-amber-100 selection:text-rose-950">
      
      {/* 🚀 STICKY CORE HEADER / NAVIGATION 🚀 */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-lg bg-white/90 backdrop-blur-md rounded-full px-5 py-2.5 border border-stone-200/50 shadow-lg flex items-center justify-between text-stone-900 animate-fade-in">
        <span className="font-serif text-xs font-extrabold tracking-widest text-rose-950 flex items-center gap-1.5 selection:bg-transparent">
          💍 LN &amp; TN
        </span>
        <div className="flex items-center gap-1.5 md:gap-3">
          <button
            id="nav-btn-invitation"
            onClick={() => { window.location.hash = ''; }}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all cursor-pointer ${
              currentPage === 'invitation' 
                ? 'bg-rose-950 text-amber-200 shadow-sm font-semibold' 
                : 'text-stone-500 hover:text-stone-900 bg-transparent'
            }`}
          >
            Thiệp Cưới 💌
          </button>
          <button
            id="nav-btn-schedule"
            onClick={() => { window.location.hash = '#schedule'; }}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1 ${
              currentPage === 'schedule'
                ? 'bg-rose-950 text-amber-200 shadow-sm font-semibold'
                : 'text-stone-500 hover:text-stone-900 bg-transparent'
            }`}
          >
            Lịch Trình Live 🟢
          </button>
        </div>
      </nav>

      {/* Floating Background Music Core Widget */}
      <MusicPlayer />

      {/* 1. HERO HOME COVER (SANG TRỌNG / ROYAL CRIMSON VISUALS) */}
      <header className="relative min-h-[95vh] md:min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden bg-gradient-to-br from-rose-950 via-rose-900 to-red-950 text-amber-100">
        
        {/* Intricate decorative border layout */}
        <div className="absolute inset-4 md:inset-8 border border-amber-500/10 rounded-2xl pointer-events-none"></div>
        <div className="absolute inset-5 md:inset-10 border border-amber-500/5 rounded-2xl pointer-events-none"></div>
        
        {/* Soft floating dust or lights effect in backend */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-bounce-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-bounce-slow" style={{ animationDelay: '2s' }}></div>

        {/* Outer classic floral ornaments illustration placeholder */}
        <div className="relative z-10 space-y-6 max-w-3xl py-12 md:py-20 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-950/40 backdrop-blur-md rounded-full border border-amber-500/20 text-[10px] md:text-xs font-mono font-bold tracking-widest uppercase text-amber-400 select-none animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" /> Save The Date
          </div>

          <p className="font-serif italic text-lg md:text-xl font-light text-amber-200/90 tracking-wide">
            Chào mừng đến với ngày trọng đại của chúng tôi
          </p>

          {/* Couples names display - Playfair style custom serif */}
          <div className="space-y-2 select-none">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold tracking-wide text-white drop-shadow-md py-1">
              Lê Nguyên <span className="text-amber-400 font-serif font-light text-2xl sm:text-3xl md:text-5xl mx-1 font-serif-italic">&</span> Thanh Như
            </h1>
            <p className="text-xs sm:text-sm tracking-widest font-mono text-amber-300 font-medium">
              01 THÁNG 07 NĂM 2026 // HỘI HÔN CHUNG ĐÔI
            </p>
          </div>

          <div className="w-12 h-[1px] bg-amber-500/40 my-6"></div>

          {/* 💌 PERSONALIZED GUEST INVITE CARD - SUPERIOR VIETNAMESE UX FEATURE 💌 */}
          {invitedGuest ? (
            <div className="w-full max-w-md bg-stone-100/95 backdrop-blur-md border border-amber-500/30 rounded-3xl p-6 md:p-8 text-stone-900 shadow-2xl relative animate-scale-up z-20">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 block mb-1">Trân Trọng Kính Mời Quý Khách</span>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-rose-950 mb-3 truncate px-2">
                {invitedGuest}
              </h2>
              <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4 text-rose-700 shrink-0">
                <Heart className="w-4 h-4 fill-rose-600 text-rose-600 animate-pulse" />
              </div>
              <p className="text-stone-500 text-xs font-light leading-relaxed mb-5">
                Sự hiện diện kính mời của bạn là vinh hạnh lớn nhất của gia đình hai bên Nhà Trai & Nhà Gái, cùng nhau chung vui và nâng chén rượu mừng cho ngày hạnh phúc trăm năm của Lê Nguyên & Thanh Như.
              </p>
              
              <button
                id="btn-rsvp-hero"
                onClick={() => handleScrollToSection('rsvp-and-venues')}
                className="w-full py-3 bg-rose-950 text-amber-200 hover:text-white hover:bg-rose-900 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all tracking-wide cursor-pointer"
              >
                Xác Nhận Tham Dự Ngay 💌
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-w-md">
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                Tình yêu của hai chúng tôi vượt qua những thăng trầm để hôm nay, trước sự chứng kiến của người thân và bè bạn bè, nguyện hứa trọn đời kề vai sát cánh.
              </p>
              <button
                id="btn-learn-more"
                onClick={() => handleScrollToSection('groom-bride-intro')}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 hover:text-white rounded-xl text-xs font-semibold shadow-md transition-all tracking-wider text-amber-50 cursor-pointer border border-amber-500/20"
              >
                Xem Thông Tin Thiệp
              </button>
            </div>
          )}

          {/* Animated bounce indicator scroll down */}
          <button 
            id="btn-scroll-indicator"
            onClick={() => handleScrollToSection('groom-bride-intro')}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 focus:outline-none hover:text-white transition-colors cursor-pointer"
          >
            <span className="text-[10px] tracking-widest font-mono uppercase font-light text-amber-400">Cuộn màn hình</span>
            <ChevronDown className="w-5 h-5 animate-bounce text-amber-400" />
          </button>
        </div>

        {/* Decorative corner borders for cover aesthetic */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-amber-500/10 rounded-tl-3xl m-4 md:m-8"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-amber-500/10 rounded-tr-3xl m-4 md:m-8"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-amber-500/10 rounded-bl-3xl m-4 md:m-8"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-amber-500/10 rounded-br-3xl m-4 md:m-8"></div>
      </header>

      {/* 2. BIOGRAPHY INTRO DETAIL PANEL */}
      <section id="groom-bride-intro" className="bg-white">
        <GroomBrideIntro groom={groomInfo} bride={brideInfo} />
      </section>

      {/* 3. INTERACTIVE LOVE STORY TIME-AXIS (CÂU CHUYỆN TÌNH YÊU) */}
      <section id="love-timeline" className="py-20 px-4 bg-stone-50 border-t border-stone-200">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16 relative">
            <span className="text-amber-600 font-serif italic text-lg block mb-2 tracking-wide font-medium">Hành trình 1 năm</span>
            <h2 className="font-serif text-3xl md:text-4xl text-rose-950 font-bold tracking-tight inline-block relative pb-4">
              Câu Chuyện Tình Yêu
              <div className="absolute bottom-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            </h2>
            <p className="text-stone-500 text-sm max-w-md mx-auto mt-4 font-light leading-relaxed">
              Từng giai đoạn gặp gỡ, thử thách và thắp lửa, trân trọng giới thiệu đến bè bạn và quan khách của chúng tôi.
            </p>
          </div>

          {/* Timeline chart items */}
          <div className="relative border-l border-stone-200 pl-6 md:pl-10 space-y-12 max-w-2xl mx-auto font-light">
            
            {[
              {
                date: 'Tháng 3 / 2026',
                title: 'Lần Đầu Gặp Gỡ 👋',
                desc: 'Chúng tôi gặp gỡ và quen biết nhau tại FSoft Hồ Chí Minh. Tình cờ đi ăn chung, tình cờ chạm mắt nhau và trúng tiếng sét ái tình.'
              },
              {
                date: 'Tháng 5 / 2026',
                title: 'Lời Tỏ Tình Ngọc Ngào ❤️',
                desc: 'Trong 1 ngày mưa tầm tã ở Sài Gòn, Lê Nguyên đã thu hết can đảm để tỏ tình với Thanh Như trước khi nghỉ việc. Sự thấu hiểu dần gắn kết hai trái tim thành một nhịp.'
              },
              {
                date: 'Tháng 6 / 2026',
                title: 'Chiếc Nhẫn Cầu Hôn Của Anh 💍',
                desc: 'Trên thành phố Đà Lạt lãng mạn dưới nắng hoàng hôn rực rỡ, Lê Nguyên quỳ gối trao chiếc nhẫn nhỏ xinh, Thanh Như rưng rưng đồng ý cùng anh xây dựng tổ ấm vững bền.'
              },
              {
                date: 'Tháng 07 / 2026',
                title: 'Ngày Trái Ngọt Trăm Năm Cưới Hỏi 🎉',
                desc: 'Một đám cưới ấm cúng ghi nhận tình yêu ngọt ngào của chúng tôi. Kính mời toàn thể người thân và bè bạn đến chúc phúc cho hôn nhân trăm năm hòa hợp!'
              }
            ].map((node, index) => (
              <div key={index} className="relative group">
                {/* Node icon circle */}
                <div className="absolute -left-10.5 md:-left-14.5 top-0 w-8 h-8 rounded-full bg-rose-50 border border-amber-500/40 flex items-center justify-center text-rose-950 shadow-md group-hover:bg-rose-900 group-hover:text-amber-100 transition-all duration-300">
                  <Heart className="w-3.5 h-3.5" />
                </div>

                {/* Content details and info */}
                <div className="bg-white border border-stone-200/60 shadow-md p-6 rounded-2xl transition-all duration-300 group-hover:shadow-lg hover:-translate-y-0.5">
                  <span className="text-[11px] font-mono tracking-wider font-bold text-amber-600 block mb-1">{node.date}</span>
                  <h3 className="font-serif text-base font-bold text-rose-950 mb-2">{node.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-light">{node.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. PHOTO ALBUM GRID MODULE */}
      <div id="section-album" className="bg-white">
        <PhotoAlbum />
      </div>

      {/* 5. COUNTDOWN & VENUES & SECURITY RSVP FORM */}
      <CountdownRSVP weddingDateTimestamp={weddingDateTimestamp} />

      {/* 6. SHARE INVITATION GENERATOR SHORTCUT */}
      <ShareInvitation />

      {/* 7. SECURE GUEST LIST ADMIN PANEL */}
      <GuestManager />

      {/* 8. FOOTER - GRATITUDE COUPLERS */}
      <footer className="bg-stone-950 text-stone-400 py-16 px-4 border-t border-stone-900 text-center select-none relative overflow-hidden">
        
        {/* Soft layout background */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-rose-900/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-md mx-auto space-y-6">
          <Heart className="w-8 h-8 text-rose-600 mx-auto fill-rose-600 animate-pulse" />
          
          <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
            Chân Thành Cảm Ơn!
          </h3>
          
          <p className="text-xs font-light leading-relaxed text-stone-400/90 max-w-sm mx-auto">
            Sự có mặt, những lời chúc mừng và tình cảm nồng ấm của quý khách là món quà quý giá nhất dành cho hai chúng tôi. Hân hạnh được đón tiếp bạn sắp tới!
          </p>

          <div className="w-8 h-[1px] bg-stone-800 mx-auto"></div>

          <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
            Lê Nguyên &amp; Thanh Như
          </div>

          <p className="text-[10px] text-stone-600 font-mono pt-4 leading-none">
            © 2026 THIỆP CƯỚI BIÊN SOẠN BẢO MẬT ONLINE // ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>

      {/* BACK TO TOP FLOATING TRIGGER BUTTON */}
      {showScrollTop && (
        <button
          id="btn-scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-rose-950/90 text-amber-100 hover:text-white hover:bg-rose-900 border border-amber-500/20 shadow-2xl flex items-center justify-center transition-all animate-bounce cursor-pointer"
          title="Về đầu trang"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}
