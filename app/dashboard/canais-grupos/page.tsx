"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { toast, Toaster } from "sonner"
import { Plus, Instagram, Trash2, Settings, Info, HelpCircle, AlertCircle, CheckCircle2, ExternalLink, Edit } from "lucide-react"
import Link from "next/link"

type InstagramAccount = {
  id: string
  username: string
  accountId: string
  profilePicture?: string | null
  followersCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

type Stats = {
  total: number
  activeCount: number
  limit: number
}

export default function CanaisGruposPage() {
  const { data: session } = useSession()
  const [accounts, setAccounts] = useState<InstagramAccount[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, activeCount: 0, limit: 1 })
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [instagramConnected, setInstagramConnected] = useState(false)

  useEffect(() => {
    if (session) {
      loadSettings()
      loadData()
    }
  }, [session])

  async function loadSettings() {
    try {
      const res = await fetch("/api/settings")
      if (!res.ok) return
      const data = await res.json()
      setInstagramConnected(data.instagramConnected || false)
    } catch (e) {
      console.error(e)
    }
  }

  async function loadData() {
    try {
      const res = await fetch("/api/instagram")
      if (!res.ok) throw new Error("Erro ao carregar contas")
      const data = await res.json()

      setAccounts(data)
      setStats({
        total: data.length,
        activeCount: data.filter((a: InstagramAccount) => a.isActive).length,
        limit: session?.user?.plan === "PRO"? 999 : 1
      })
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function conectarInstagram() {
    setIsSaving(true)
    try {
      const res = await fetch('/api/instagram/auth')
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (e: any) {
      toast.error(e.message || 'Erro ao conectar')
    } finally {
      setIsSaving(false)
    }
  }

  async function removerConta(id: string) {
    if (!confirm("Deseja remover esta conta do Instagram?")) return

    try {
      const res = await fetch(`/api/instagram/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erro ao excluir")
      }
      toast.success("Conta removida com sucesso")
      loadData()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  async function toggleStatus(id: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/instagram/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive:!currentStatus })
      })
      if (!res.ok) throw new Error("Erro ao atualizar status")
      loadData()
      toast.success(!currentStatus? "Conta ativada" : "Conta desativada")
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const limiteAtingido = stats.total >= stats.limit

  return (
    <div className="space-y-5">
      <Toaster richColors />

      {/* Banner INICIANTES */}
      <div className="rounded-lg border border-[#FFE082] bg-[#FFF8E1] px-5 py-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm leading-relaxed text-amber-900">
            <span className="mr-1">⚠️</span>
            <strong>Atenção:</strong> Você está utilizando o plano <strong>INICIANTES (7 dias grátis)</strong>, que possui limitações, como marca d'água nos posts. Para desbloquear todos os recursos, considere fazer um upgrade!
          </p>
          <button className="inline-flex items-center rounded-md bg-[#FFC107] px-4 py-2 text-sm font-bold text-slate-900 hover:bg-amber-400">
            Upgrade Agora 🚀
          </button>
        </div>
      </div>

      {/* Header Gerenciar Canais */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-gray-600" />
            <h2 className="text-base font-semibold text-gray-900">Gerenciar Instagram</h2>
          </div>
          <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
            <Info size={14} />
            <span>Configure suas contas e organize suas publicações automáticas</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={conectarInstagram}
            disabled={limiteAtingido || isSaving}
            className="flex items-center gap-2 rounded-md bg-[#1976D2] px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <Plus size={18} />
            {isSaving? "Conectando..." : "Adicionar Conta"}
          </button>
          {limiteAtingido && (
            <p className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle size={12} />
              Limite atingido: {stats.total}/{stats.limit}
            </p>
          )}
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Contas Instagram</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Instagram className="h-10 w-10 text-pink-600" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ativas Agora</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.activeCount}</p>
            </div>
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Limite do Plano</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.limit === 999? '∞' : stats.limit}</p>
            </div>
            <Settings className="h-10 w-10 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Lista de Contas */}
      <div className="space-y-3">
        {loading? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Carregando...</p>
          </div>
        ) : accounts.length === 0? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <Instagram className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-sm text-gray-600">
              Nenhuma conta do Instagram conectada ainda
            </p>
            <button
              onClick={conectarInstagram}
              disabled={limiteAtingido || isSaving}
              className="mt-4 rounded-lg bg-[#1976D2] px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Conectar Primeira Conta
            </button>
          </div>
        ) : (
          accounts.map((account) => (
            <div
              key={account.id}
              className="rounded-lg border border-gray-300 bg-white p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <img
                    src={account?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(account?.username || 'I')}&background=random`}
                    alt={account?.username || 'Instagram'}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900">@{account.username}</h3>
                    <span className="rounded bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-700">
                      Instagram
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Seguidores:</span>
                      <span className="font-semibold text-gray-900">
                        {account.followersCount.toLocaleString('pt-BR')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Status:</span>
                      <button
                        onClick={() => toggleStatus(account.id, account.isActive)}
                        className={`rounded px-2 py-0.5 text-xs font-semibold ${
                          account.isActive
                           ? "bg-[#E8F5E9] text-[#2E7D32]"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {account.isActive? "ATIVO" : "INATIVO"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/dashboard/canais-grupos/${account.id}`}
                      className="flex items-center gap-1.5 rounded-md bg-[#1976D2] px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      <Edit size={15} />
                      Configurar Posts
                    </Link>
                    <button
                      onClick={() => removerConta(account.id)}
                      className="flex items-center gap-1.5 rounded-md border border-red-500 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Banner Ajuda */}
      <div className="rounded-lg border border-[#B3E5FC] bg-[#E1F5FE] p-4">
        <p className="flex items-center gap-2 text-sm text-[#0277BD]">
          <HelpCircle size={16} />
          <strong>Precisa de ajuda?</strong> Assista nosso tutorial em vídeo
          <a href="#" className="ml-1 font-semibold text-[#1976D2] hover:underline">
            clicando aqui <ExternalLink size={12} className="inline" />
          </a>
        </p>
      </div>
    </div>
  )
}