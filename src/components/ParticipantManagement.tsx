import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  UserPlus,
  Search,
  Copy,
  Check,
  Power,
  ShieldAlert,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const ParticipantManagement: React.FC = () => {
  const { token } = useAuth();
  const [participants, setParticipants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Create Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAccountNotice, setCreatedAccountNotice] = useState<{
    name: string;
    username: string;
  } | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  // Toggle Confirm Modal
  const [toggleConfirmTarget, setToggleConfirmTarget] = useState<any | null>(null);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/facilitator/participants', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setParticipants(data.participants || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipantName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/facilitator/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newParticipantName.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setCreatedAccountNotice({
          name: data.participant.name,
          username: data.participant.username,
        });
        setNewParticipantName('');
        setIsCreateModalOpen(false);
        fetchParticipants();
      } else {
        alert(data.error || 'Gagal membuat akun peserta.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (target: any) => {
    try {
      const res = await fetch(`/api/facilitator/participants/${target.id}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !target.isActive }),
      });

      if (res.ok) {
        setToggleConfirmTarget(null);
        fetchParticipants();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const filteredParticipants = participants.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    return p.name.toLowerCase().includes(q) || p.username.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-white rounded-3xl border border-[#D98BAA]/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#FDF2F4] text-[#B51F36] border border-[#B51F36]/20">
              <Users className="w-4 h-4 text-[#B51F36]" />
            </span>
            <span className="text-xs font-bold text-[#B51F36] uppercase tracking-wider">
              Administrasi Peserta
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#243B53]">Manajemen Akun Peserta</h2>
          <p className="text-xs text-[#78838A] mt-1 max-w-xl">
            Buat akun peserta baru dengan format username otomatis <code className="text-[#B51F36] font-semibold">nama_nomor</code>, atur status keaktifan, dan pantau progres individu.
          </p>
        </div>

        <button
          onClick={() => {
            setCreatedAccountNotice(null);
            setIsCreateModalOpen(true);
          }}
          className="px-5 py-3 rounded-2xl bg-[#B51F36] text-white hover:bg-[#96192c] active:scale-[0.99] transition-all text-xs font-bold flex items-center gap-2 shadow-md shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Akun Peserta</span>
        </button>
      </div>

      {/* Success Notification for Newly Created Account */}
      {createdAccountNotice && (
        <div className="p-4 bg-[#FDF2F4] border border-[#B51F36]/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#243B53]">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#B51F36] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Akun Peserta Berhasil Dibuat!</p>
              <p className="text-[#78838A] mt-0.5">
                Nama: <strong>{createdAccountNotice.name}</strong> • Username:{' '}
                <code className="font-mono bg-white px-2 py-0.5 rounded border border-[#D98BAA]/30 text-[#B51F36] font-bold">
                  {createdAccountNotice.username}
                </code>
              </p>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(createdAccountNotice.username)}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#E2E6E3] hover:bg-gray-50 font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
          >
            {hasCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#059669]" />
                <span className="text-[#059669]">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#78838A]" />
                <span>Salin Username</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Filter and Table Card */}
      <div className="bg-white rounded-2xl border border-[#E2E6E3] shadow-xs overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b border-[#E2E6E3] bg-[#F6F7F5] flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#78838A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama atau username..."
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#E2E6E3] rounded-xl text-xs text-[#29343B] placeholder-[#78838A] focus:outline-none focus:ring-1 focus:ring-[#6B9B91]"
            />
          </div>
          <span className="text-xs text-[#78838A]">
            Menampilkan <strong>{filteredParticipants.length}</strong> peserta
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6F7F5] text-[#78838A] font-semibold border-b border-[#E2E6E3]">
              <tr>
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">Username (Format nama_nomor)</th>
                <th className="py-3 px-4">Nomor</th>
                <th className="py-3 px-4">Progres Program</th>
                <th className="py-3 px-4">Status Akun</th>
                <th className="py-3 px-4">Tanggal Dibuat</th>
                <th className="py-3 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E6E3]">
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#78838A]">
                    {searchQuery ? 'Tidak ada peserta yang cocok dengan kata kunci pencarian.' : 'Belum ada peserta yang terdaftar.'}
                  </td>
                </tr>
              ) : (
                filteredParticipants.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F6F7F5]/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#243B53]">{p.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <code className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[#243B53]">
                          {p.username}
                        </code>
                        <button
                          onClick={() => copyToClipboard(p.username)}
                          title="Salin username"
                          className="p-1 text-[#78838A] hover:text-[#243B53]"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#78838A]">{p.participantNumber || '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 max-w-[130px]">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            style={{ width: `${p.progress?.overallPercentage || 0}%` }}
                            className="bg-[#6B9B91] h-full rounded-full"
                          ></div>
                        </div>
                        <span className="font-semibold text-[#243B53] text-[11px] shrink-0">
                          {p.progress?.overallPercentage || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {p.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#78838A]">
                      {new Date(p.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setToggleConfirmTarget(p)}
                        className={`p-1.5 rounded-lg border text-[11px] font-semibold transition-colors ${
                          p.isActive
                            ? 'text-red-700 bg-red-50 hover:bg-red-100 border-red-200'
                            : 'text-green-700 bg-green-50 hover:bg-green-100 border-green-200'
                        }`}
                        title={p.isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                      >
                        {p.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE PARTICIPANT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E2E6E3] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E6E3]">
              <h3 className="text-base font-bold text-[#243B53]">Tambah Akun Peserta Baru</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-[#78838A] hover:text-[#243B53]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateParticipant} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#29343B] mb-1">
                  Nama Lengkap Peserta
                </label>
                <input
                  type="text"
                  required
                  value={newParticipantName}
                  onChange={(e) => setNewParticipantName(e.target.value)}
                  placeholder="Contoh: Siti Aminah"
                  className="w-full px-3.5 py-2.5 bg-[#F6F7F5] border border-[#E2E6E3] rounded-xl text-xs text-[#29343B] focus:outline-none focus:ring-1 focus:ring-[#6B9B91]"
                />
                <p className="mt-2 text-[11px] text-[#78838A] leading-relaxed">
                  Sistem akan secara otomatis menghasilkan username unik berformat{' '}
                  <code className="text-[#243B53] font-semibold">nama_nomor</code> (contoh:{' '}
                  <span className="text-[#6B9B91]">siti_aminah_005</span>). Peserta masuk tanpa kata sandi.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78838A] hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newParticipantName.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#243B53] hover:bg-[#1a2c3f] disabled:opacity-40"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Buat Akun Peserta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM TOGGLE ACTIVE MODAL */}
      {toggleConfirmTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E2E6E3] space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-[#243B53]">
                Konfirmasi {toggleConfirmTarget.isActive ? 'Nonaktifkan' : 'Aktifkan'} Akun
              </h3>
            </div>

            <p className="text-xs text-[#29343B] leading-relaxed">
              Apakah Anda yakin ingin {toggleConfirmTarget.isActive ? 'menonaktifkan' : 'mengaktifkan'} akun{' '}
              <strong>{toggleConfirmTarget.name}</strong> (<code>{toggleConfirmTarget.username}</code>)?
            </p>

            {toggleConfirmTarget.isActive && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 leading-normal">
                Catatan: Akun nonaktif tidak akan dapat masuk ke aplikasi. <strong>Seluruh riwayat progres dan evaluasi tetap tersimpan aman di sistem.</strong>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setToggleConfirmTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78838A] hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleToggleActive(toggleConfirmTarget)}
                className={`px-5 py-2 rounded-xl text-xs font-semibold text-white ${
                  toggleConfirmTarget.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
