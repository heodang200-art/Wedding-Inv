import React, { useState, useEffect } from 'react';
import { 
  Heart, Calendar, MapPin, Sparkles, Clock, Plus, Trash2, Edit, Save, 
  Undo, CheckCircle2, ArrowUp, ArrowDown, Play, Lock, 
  Settings, Share2, Camera, Music, Gift, Car, Sliders, X, RefreshCw, Check
} from 'lucide-react';
import { ScheduleItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

// A dynamic helper to render Lucide icons based on string values
function ScheduleIcon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
  const iconsMap: { [key: string]: any } = {
    Heart, Calendar, MapPin, Sparkles, Clock, Plus, Trash2, Edit, Save, 
    Undo, CheckCircle2, ArrowUp, ArrowDown, Play, Lock, Settings, Share2, 
    Camera, Music, Gift, Car, Sliders, X, RefreshCw, Check
  };
  const IconComponent = iconsMap[name] || Clock;
  return <IconComponent className={className} />;
}

const DEFAULT_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sch_1',
    time: '07:30',
    title: 'Nhà Trai Xuất Phát',
    desc: 'Chú rể Lê Nguyên cùng đại diện gia đình nhà trai xuất phát mang theo sính lễ trang trọng sang nhà gái.',
    location: 'Tư gia Nhà Trai',
    icon: 'Car',
    status: 'completed'
  },
  {
    id: 'sch_2',
    time: '08:30',
    title: 'Lễ Vu Quy & Gia Tiên',
    desc: 'Nghi thức dâng hương, lạy tổ tiên, trao nhẫn cưới kết duyên. Hai bên gia đình chính thức chúc phúc cho cặp đôi.',
    location: 'Võ Gia Palace (Tư gia Nhà Gái)',
    icon: 'Heart',
    status: 'completed'
  },
  {
    id: 'sch_3',
    time: '10:30',
    title: 'Đón Tiếp Quan Khách',
    desc: 'Chào mừng quan khách, bạn bè thân hữu đến tham dự không gian cưới, ký tên lưu niệm và chụp ảnh cùng Cô Dâu & Chú Rể.',
    location: 'Sảnh tiệc chính Võ Gia Palace',
    icon: 'Camera',
    status: 'ongoing'
  },
  {
    id: 'sch_4',
    time: '11:00',
    title: 'Khai Mạc Lễ Thành Hôn',
    desc: 'Lễ thành hôn chính thức bắt đầu: Cắt bánh kem, rót rượu giao bôi, phát biểu tri ân quan khách hai gia đình.',
    location: 'Sân khấu chính Võ Gia Palace',
    icon: 'Sparkles',
    status: 'upcoming'
  },
  {
    id: 'sch_5',
    time: '12:15',
    title: 'Giao Lưu Âm Nhạc & Khai Tiệc',
    desc: 'Thưởng thức ẩm thực tiệc cưới hảo hạng, kết hợp các tiết mục văn nghệ chúc mừng đặc sắc và Trò Chơi Mini có thưởng.',
    location: 'Phòng đại tiệc',
    icon: 'Music',
    status: 'upcoming'
  },
  {
    id: 'sch_6',
    time: '13:30',
    title: 'Cảm Ơn & Tiễn Khách',
    desc: 'Cực kỳ trân trọng gửi lời cảm ơn sâu sắc, trao quà lưu niệm nhỏ xinh và tiễn biệt quý quan khách ra về bình an.',
    location: 'Cổng chào sảnh tiệc',
    icon: 'Gift',
    status: 'upcoming'
  }
];

const LOCAL_STORAGE_KEY = 'vietnamese_wedding_schedule_live';

export default function LiveSchedule({ onBackToInvitation }: { onBackToInvitation: () => void }) {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Form State for Adding / Editing items
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [formTime, setFormTime] = useState('11:30');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formIcon, setFormIcon] = useState('Heart');
  const [formStatus, setFormStatus] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');

  // Load from local storage or set default on mount
  useEffect(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      try {
        setSchedule(JSON.parse(data));
      } catch (e) {
        setSchedule(DEFAULT_SCHEDULE);
      }
    } else {
      setSchedule(DEFAULT_SCHEDULE);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SCHEDULE));
    }
  }, []);

  const saveToStorage = (updatedSchedule: ScheduleItem[]) => {
    setSchedule(updatedSchedule);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSchedule));
  };

  const handleResetToDefault = () => {
    if (window.confirm('Bạn có chắc chắn muốn cài lại lịch trình mặc định ban đầu không?')) {
      saveToStorage(DEFAULT_SCHEDULE);
    }
  };

  const handleOpenAddForm = () => {
    setEditingItem(null);
    setFormTime('12:00');
    setFormTitle('');
    setFormDesc('');
    setFormLocation('');
    setFormIcon('Heart');
    setFormStatus('upcoming');
    setShowConfigModal(true);
  };

  const handleOpenEditForm = (item: ScheduleItem) => {
    setEditingItem(item);
    setFormTime(item.time);
    setFormTitle(item.title);
    setFormDesc(item.desc);
    setFormLocation(item.location || '');
    setFormIcon(item.icon || 'Heart');
    setFormStatus(item.status);
    setShowConfigModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTime || !formTitle) {
      alert('Vui lòng điền đủ Thời gian và Tiêu đề!');
      return;
    }

    if (editingItem) {
      // Edit mode
      const updated = schedule.map(item => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            time: formTime,
            title: formTitle,
            desc: formDesc,
            location: formLocation,
            icon: formIcon,
            status: formStatus
          };
        }
        return item;
      });
      // Re-sort schedule by time
      updated.sort((a, b) => a.time.localeCompare(b.time));
      saveToStorage(updated);
    } else {
      // Add mode
      const newItem: ScheduleItem = {
        id: 'sch_' + Math.random().toString(36).substring(2, 11),
        time: formTime,
        title: formTitle,
        desc: formDesc,
        location: formLocation,
        icon: formIcon,
        status: formStatus
      };
      const updated = [...schedule, newItem];
      updated.sort((a, b) => a.time.localeCompare(b.time));
      saveToStorage(updated);
    }

    setShowConfigModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa mốc lịch trình này không?')) {
      const updated = schedule.filter(item => item.id !== id);
      saveToStorage(updated);
    }
  };

  const handleUpdateStatus = (id: string, status: 'upcoming' | 'ongoing' | 'completed', e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = schedule.map(item => {
      // If we mark something as ongoing, we can optionally change others
      if (status === 'ongoing' && item.id !== id && item.status === 'ongoing') {
        return { ...item, status: 'completed' as const };
      }
      if (item.id === id) {
        return { ...item, status };
      }
      return item;
    });
    saveToStorage(updated);
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const newItems = [...schedule];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx >= 0 && targetIdx < newItems.length) {
      const temp = newItems[index];
      newItems[index] = newItems[targetIdx];
      newItems[targetIdx] = temp;
      saveToStorage(newItems);
    }
  };

  const currentOngoingEvent = schedule.find(item => item.status === 'ongoing');
  const nextEvent = schedule.find(item => item.status === 'upcoming');

  const handleCopyShareLink = () => {
    const inviteUrl = window.location.origin + window.location.pathname + '#schedule';
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 select-none relative pb-24">
      {/* Decors background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto z-10 relative">
        
        {/* Navigation back and title */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 border-b border-stone-200/50 pb-6">
          <div className="flex items-center gap-3">
            <button
              id="btn-back-to-inv"
              onClick={onBackToInvitation}
              className="px-4 py-2 bg-white text-stone-700 hover:text-stone-900 border border-stone-200 relative rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all font-mono tracking-wide cursor-pointer flex items-center gap-1.5"
            >
              <Undo className="w-3.5 h-3.5 text-stone-500" /> Quay Lại Thiệp Cưới
            </button>
            <span className="text-stone-300">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider font-mono">Bảng Lịch Trình Trực Tiếp (Live)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-share-live-schedule"
              onClick={handleCopyShareLink}
              className="px-3.5 py-2 bg-rose-50/70 text-rose-950 border border-rose-100 hover:bg-rose-100/80 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-rose-700 font-bold" /> 
              {copiedLink ? <span className="text-green-600 font-bold">Đã sao chép link!</span> : <span>Chia sẻ lịch trình</span>}
            </button>

            <button
              id="btn-admin-mode-toggle"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm border transition-all flex items-center gap-1.5 cursor-pointer ${
                isAdminMode 
                  ? 'bg-amber-100 border-amber-300 text-amber-800 font-bold' 
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Settings className={`w-3.5 h-3.5 ${isAdminMode ? 'animate-spin' : ''}`} />
              {isAdminMode ? 'Chế độ Quản Trị: Bật' : 'Quản trị lịch trình'}
            </button>
          </div>
        </div>

        {/* Header Hero card */}
        <div className="bg-gradient-to-br from-rose-950 to-amber-950 rounded-3xl p-6 md:p-8 text-amber-100 shadow-xl mb-8 relative overflow-hidden border border-amber-500/10">
          <div className="absolute inset-4 border border-amber-500/5 rounded-2xl pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>

          <div className="max-w-xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 rounded-full border border-amber-500/20 text-[9px] font-mono font-bold tracking-widest uppercase text-amber-400 mb-3">
              💍 July 01, 2026
            </span>
            <h1 className="font-serif text-2xl md:text-4xl font-bold tracking-tight mb-2 text-white">
              Lịch Trình Đám Cưới Trực Tiếp
            </h1>
            <p className="text-xs text-amber-200/70 font-light leading-relaxed mb-6">
              Kính thưa quý thực khách và bè bạn, đây là dòng thời gian thực tế diễn ra lễ cưới ngày cưới của Lê Nguyên & Thanh Như. Lịch trình cập nhật liên tục để quý khách đồng hành trọn vẹn nhất cùng niềm hạnh phúc trăm năm nhé!
            </p>

            {/* Current visual block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-amber-500/15 pt-5 text-stone-900 mt-2">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-amber-500/20 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-rose-800 block mb-1">Hiện Tại Đang Diễn Ra 🟢</span>
                  <p className="font-serif text-sm font-bold text-rose-950 truncate">
                    {currentOngoingEvent ? currentOngoingEvent.title : 'Chưa có sự kiện nào đang chạy...'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono mt-2">
                  <Clock className="w-3.5 h-3.5 text-stone-400" /> At {currentOngoingEvent ? currentOngoingEvent.time : 'N/A'} // {currentOngoingEvent ? currentOngoingEvent.location : 'N/A'}
                </div>
              </div>

              <div className="bg-amber-100/95 backdrop-blur-md rounded-2xl p-4 border border-amber-500/20 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-amber-800 block mb-1">Chuẩn Bị Đến 🔔</span>
                  <p className="font-serif text-sm font-bold text-amber-950 truncate">
                    {nextEvent ? nextEvent.title : 'Đám cưới kết thúc viên mãn!'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono mt-2">
                  <Clock className="w-3.5 h-3.5 text-stone-400" /> Sắp diễn ra lúc: {nextEvent ? nextEvent.time : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin floating or secondary manager toolbar */}
        {isAdminMode && (
          <div className="bg-yellow-50/80 border border-amber-200 rounded-2xl p-4 mb-8 flex flex-wrap gap-4 items-center justify-between text-xs text-amber-900 animate-scale-up">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              <p className="font-semibold">Bạn đang ở Chế độ cấu hình sự kiện đám cưới của mình.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="btn-admin-add-item"
                onClick={handleOpenAddForm}
                className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm mốc lịch trình
              </button>
              <button
                id="btn-admin-reset"
                onClick={handleResetToDefault}
                className="px-3.5 py-1.5 bg-white hover:bg-stone-100 border border-amber-300 text-stone-700 rounded-lg transition-all flex items-center gap-1 cursor-pointer font-medium"
              >
                <RefreshCw className="w-3 h-3 text-stone-500" /> Phục hồi mặc định
              </button>
            </div>
          </div>
        )}

        {/* Timelines Area */}
        <div id="timeline-scroll-anchor" className="relative pl-6 md:pl-12 border-l-2 border-stone-200 mt-12 py-4">
          
          {/* Timeline continuous filling progress line */}
          <div className="absolute left-0 top-0 bottom-0 -ml-[2px] w-[2px] bg-gradient-to-b from-green-500 via-amber-500 to-stone-200 pointer-events-none"></div>

          <div className="space-y-10">
            {schedule.length === 0 ? (
              <div className="bg-white border rounded-2xl p-10 text-center text-stone-400">
                <Sliders className="w-10 h-10 mx-auto text-stone-200 mb-3" />
                <p className="text-sm font-light">Không có mốc lịch trình nào.</p>
                {isAdminMode && (
                  <button onClick={handleOpenAddForm} className="mt-4 text-xs font-bold text-amber-700 underline">
                    Thêm một mốc ngay!
                  </button>
                )}
              </div>
            ) : (
              schedule.map((node, index) => {
                let statusBgClass = 'bg-stone-100 border-stone-200 text-stone-400';
                let statusLabel = 'Chưa diễn ra';
                let cardBorderClass = 'border-stone-200 shadow-sm';
                let pulseRing = null;

                if (node.status === 'completed') {
                  statusBgClass = 'bg-green-50 border-green-200 text-green-700';
                  statusLabel = 'Đồng ý / Đã xong';
                  cardBorderClass = 'border-green-100/80 bg-white/70 shadow-sm opacity-85';
                } else if (node.status === 'ongoing') {
                  statusBgClass = 'bg-rose-50 border-rose-200 text-rose-700 font-bold ring-1 ring-rose-300';
                  statusLabel = 'Đang diễn ra';
                  cardBorderClass = 'border-rose-300 ring-1 ring-rose-100 bg-white shadow-md scale-[1.01]';
                  pulseRing = (
                    <span className="absolute -left-12.5 md:-left-16 top-1 w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/10 animate-ping z-0"></span>
                  );
                }

                return (
                  <div key={node.id} className="relative group">
                    {/* Visual Node icon */}
                    {pulseRing}
                    <div className={`absolute -left-11.5 md:-left-15 top-1.5 w-7 h-7 rounded-full border flex items-center justify-center shadow-md transition-all z-10 ${
                      node.status === 'completed' 
                        ? 'bg-green-600 border-green-700 text-white' 
                        : node.status === 'ongoing' 
                        ? 'bg-rose-600 border-rose-700 text-white animate-pulse' 
                        : 'bg-white border-stone-300 text-stone-500'
                    }`}>
                      <ScheduleIcon name={node.icon || 'Clock'} className="w-3.5 h-3.5" />
                    </div>

                    {/* Timeline box layout */}
                    <div className={`bg-white rounded-2xl p-5 md:p-6 border transition-all duration-300 relative ${cardBorderClass}`}>
                      
                      {/* Top ribbon time / status */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base md:text-lg font-extrabold text-stone-800 tracking-tight flex items-center gap-1">
                            <Clock className="w-4 h-4 text-stone-400" /> {node.time}
                          </span>
                          
                          <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold border shrink-0 ${statusBgClass}`}>
                            {statusLabel}
                          </span>

                          {node.location && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 font-light truncate max-w-[200px] md:max-w-[300px]">
                              <MapPin className="w-3 h-3 text-stone-400 shrink-0" /> {node.location}
                            </span>
                          )}
                        </div>

                        {/* Interactive Admin Quick controls inline */}
                        {isAdminMode ? (
                          <div className="flex items-center gap-1.5 text-xs">
                            {/* Reorder and State setters */}
                            <button
                              id={`btn-order-up-${index}`}
                              disabled={index === 0}
                              onClick={(e) => handleMoveOrder(index, 'up', e)}
                              className="p-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-500 disabled:opacity-30 border cursor-pointer"
                              title="Di chuyển lên"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`btn-order-down-${index}`}
                              disabled={index === schedule.length - 1}
                              onClick={(e) => handleMoveOrder(index, 'down', e)}
                              className="p-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-500 disabled:opacity-30 border cursor-pointer"
                              title="Di chuyển xuống"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            
                            {/* Status controls */}
                            <div className="h-4 w-[1px] bg-stone-200 mx-1"></div>
                            {node.status !== 'completed' && (
                              <button
                                id={`btn-status-complete-${node.id}`}
                                onClick={(e) => handleUpdateStatus(node.id, 'completed', e)}
                                className="px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200 font-mono text-[9px] font-bold cursor-pointer hover:bg-green-100"
                                title="Đánh dấu Hoàn thành đạt"
                              >
                                Đã xong
                              </button>
                            )}
                            {node.status !== 'ongoing' && (
                              <button
                                id={`btn-status-ongoing-${node.id}`}
                                onClick={(e) => handleUpdateStatus(node.id, 'ongoing', e)}
                                className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-mono text-[9px] font-bold cursor-pointer hover:bg-rose-100"
                                title="Set thành sự kiện Đang diễn ra"
                              >
                                Chạy live
                              </button>
                            )}
                            {node.status !== 'upcoming' && (
                              <button
                                id={`btn-status-upcoming-${node.id}`}
                                onClick={(e) => handleUpdateStatus(node.id, 'upcoming', e)}
                                className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-mono text-[9px] font-bold cursor-pointer hover:bg-amber-100"
                                title="Set lại là Chờ diễn ra"
                              >
                                Standby
                              </button>
                            )}

                            {/* Core CRUD controls */}
                            <div className="h-4 w-[1px] bg-stone-200 mx-1"></div>
                            <button
                              id={`btn-edit-item-${node.id}`}
                              onClick={() => handleOpenEditForm(node)}
                              className="p-1 rounded text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 cursor-pointer"
                              title="Sửa chi tiết"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`btn-delete-item-${node.id}`}
                              onClick={(e) => handleDeleteItem(node.id, e)}
                              className="p-1 rounded text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 cursor-pointer"
                              title="Xóa mốc"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          // Normal guest view state indicators
                          node.status === 'ongoing' && (
                            <span className="flex items-center gap-1 text-[11px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-100 shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span> Live Now
                            </span>
                          )
                        )}
                      </div>

                      {/* Title & info description */}
                      <div>
                        <h3 className="font-serif text-base font-bold text-stone-900 mb-1.5 flex items-center gap-2">
                          {node.title}
                        </h3>
                        <p className="text-xs text-stone-600 font-light leading-relaxed">
                          {node.desc}
                        </p>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal for adding/editing config items */}
        <AnimatePresence>
          {showConfigModal && (
            <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl w-full max-w-md border border-stone-200 shadow-2xl overflow-hidden text-stone-800"
              >
                {/* Header modal */}
                <div className="bg-rose-950 text-amber-200 px-6 py-4 flex items-center justify-between border-b border-rose-900">
                  <h3 className="font-serif text-base font-bold">
                    {editingItem ? 'Sửa Mốc Lịch Trình' : 'Thêm Mốc Lịch Trình Mới'}
                  </h3>
                  <button
                    id="btn-close-modal"
                    onClick={() => setShowConfigModal(false)}
                    className="p-1 text-rose-300 hover:text-white rounded-lg transition-all border border-rose-900/50 hover:border-rose-400/40 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Form Body */}
                <form id="schedule-config-form" onSubmit={handleSaveItem} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Thời gian (HH:MM) *</label>
                      <input
                        id="form-time-input"
                        type="time"
                        required
                        value={formTime}
                        onChange={(e) => setFormTime(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Trạng thái *</label>
                      <select
                        id="form-status-select"
                        value={formStatus}
                        onChange={(e: any) => setFormStatus(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                      >
                        <option value="upcoming">Sắp tới (Standby)</option>
                        <option value="ongoing">Đang diễn ra (Live)</option>
                        <option value="completed">Đã hoàn thành</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Tiêu đề mốc sự kiện *</label>
                    <input
                      id="form-title-input"
                      type="text"
                      required
                      placeholder="Ví dụ: Rót rượu giao bôi"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Địa điểm cụ thể</label>
                    <input
                      id="form-loc-input"
                      type="text"
                      placeholder="Ví dụ: Sân khấu sảnh tiệc chính"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Icon đại diện</label>
                      <select
                        id="form-icon-select"
                        value={formIcon}
                        onChange={(e) => setFormIcon(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                      >
                        <option value="Heart">❤️ Trái tim (Heart)</option>
                        <option value="Sparkles">✨ Nghi lễ (Sparkles)</option>
                        <option value="Clock">⏰ Đồng hồ (Clock)</option>
                        <option value="Camera">📸 Chụp ảnh (Camera)</option>
                        <option value="Music">🎵 Giao lưu ca nhạc (Music)</option>
                        <option value="Gift">🎁 Rút thăm / Quà tặng (Gift)</option>
                        <option value="Car">🚗 Đưa tiễn / Di chuyển (Car)</option>
                        <option value="Calendar">📅 Lịch (Calendar)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-center bg-stone-50 rounded-xl border border-dashed border-stone-200">
                      <div className="text-center">
                        <span className="text-[10px] text-stone-400 block mb-1">Preview Icon</span>
                        <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center mx-auto border border-rose-100">
                          <ScheduleIcon name={formIcon} className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Mô tả ngắn gọn</label>
                    <textarea
                      id="form-desc-textarea"
                      rows={3}
                      placeholder="Vài dòng tóm tắt diễn biến mốc này để thực khách tiện phối hợp cùng ekip..."
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none resize-none font-light"
                    ></textarea>
                  </div>

                  {/* Buttons controls */}
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                    <button
                      id="btn-modal-cancel"
                      type="button"
                      onClick={() => setShowConfigModal(false)}
                      className="flex-1 py-2.5 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Bỏ qua
                    </button>
                    <button
                      id="btn-modal-save"
                      type="submit"
                      className="flex-1 py-2.5 bg-rose-950 text-amber-200 hover:text-white hover:bg-rose-900 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                    >
                      {editingItem ? 'Lưu chỉnh sửa' : 'Thêm mốc'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
