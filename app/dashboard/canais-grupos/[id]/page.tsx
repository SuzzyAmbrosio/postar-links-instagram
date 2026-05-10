"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast, Toaster } from "sonner"
import {
  Globe, Layout, Instagram, Calendar, MessageSquare, Save, AlertTriangle,
  ShoppingBag, Package, Heart, Shirt, Users, Video, Link2,
  RefreshCw, AlertCircle, Upload, X, TrendingUp, Unlink, ImageIcon, ExternalLink, MessageCircle, Wand2, LinkIcon, Info,
  ArrowLeft, Eye, Edit, Send, Pencil, CheckCircle2, Clock, Trash2, Plus
} from "lucide-react"

// SÓ INSTAGRAM AGORA
const tabsRow1 = [
  { id: "editar", label: "Editar Conta", icon: Edit },
  { id: "layout", label: "Layout Post", icon: Layout },
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "instasched", label: "InstaSched", icon: Calendar },
  { id: "instabot", label: "InstaBotHelp", icon: MessageSquare },
  { id: "postmanual", label: "Post Manual", icon: Globe },
]

const tabsRow2 = [
  { id: "aliexpress", label: "AliExpress", icon: ShoppingBag },
  { id: "amazon", label: "Amazon", icon: Package },
  { id: "mercadolivre", label: "Mercado Livre", icon: Heart },
  { id: "shein", label: "Shein", icon: Shirt },
  { id: "shopee", label: "Shopee", icon: ShoppingBag },
  { id: "colaboradores", label: "Colaboradores", icon: Users },
]

export default function EditarCanalPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()

  const accountId = params.id as string
  const [activeTab, setActiveTab] = useState("instagram")
  const [userPlan, setUserPlan] = useState("INICIANTE")
  const [account, setaccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [accountsList, setaccountsList] = useState<any[]>([])
  const [selectedaccountId, setSelectedaccountId] = useState(accountId)
  const [loadingaccounts, setLoadingaccounts] = useState(true)

  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (session) {
      loadUserPlan()
      loadaccountsList()
    }
  }, [session])

  useEffect(() => {
    if (session && accountId) {
      loadaccount(accountId)
    }
  }, [session, accountId])

  async function loadUserPlan() {
    try {
      const res = await fetch("/api/user")
      if (res.ok) {
        const data = await res.json()
        setUserPlan(data.plan || "INICIANTE")
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function loadaccount(id: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/instagram/${id}`)
      if (!res.ok) throw new Error("Conta não encontrada")
      const found = await res.json()
      setaccount(found)
      setSelectedaccountId(found.id)
    } catch (e: any) {
      console.error(e)
      toast.error("Erro ao carregar conta")
      router.push("/dashboard/canais-grupos")
    } finally {
      setLoading(false)
    }
  }

  async function loadaccountsList() {
    setLoadingaccounts(true)
    try {
      const res = await fetch(`/api/instagram`)
      const data = await res.json()
      setaccountsList(data || [])
    } catch (e) {
      toast.error('Erro ao carregar lista de contas')
    } finally {
      setLoadingaccounts(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-12 text-center">
        <RefreshCw className="mx-auto mb-2 animate-spin" size={32} />
        <p className="text-gray-600">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster richColors />

      {userPlan === "INICIANTE" && (
        <div className="mx-4 mt-4 rounded-lg bg-[#FFF8E1] px-5 py-3 text-center">
          <button className="inline-flex items-center rounded-md bg-[#FFC107] px-4 py-2 text-sm font-bold text-slate-900 hover:bg-amber-400">
            Upgrade Agora 🚀
          </button>
        </div>
      )}

      <div className="mx-4 mt-4 flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
        <Link href="/dashboard/canais-grupos" className="rounded-md p-2 hover:bg-gray-100">
          <ArrowLeft size={20} />
        </Link>
        <img
          src={account?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(account?.username || 'C')}&background=random`}
          alt={account?.username || 'Conta'}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-900">Editar: @{account?.username || 'Carregando...'}</span>
          <button
            onClick={() => loadaccount(accountId)}
            className="flex items-center gap-1 rounded bg-[#1976D2] px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700"
          >
            <RefreshCw size={12} />
            Atualizar
          </button>
        </div>
      </div>

      <div className="mx-4 mt-4 rounded-lg border border-gray-200 bg-white">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 px-4 py-3">
          {tabsRow1.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.id
                ? "bg-[#1976D2] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap gap-2 border-b border-gray-200 px-4 py-2">
          {tabsRow2.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  activeTab === tab.id
                ? "bg-[#1976D2] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="w-full px-4 mt-4 pb-8">
        {activeTab === "postmanual" && (
          <PostManualTab
            account={account}
            loadaccount={() => loadaccount(accountId)}
            accountsList={accountsList}
            selectedaccountId={selectedaccountId}
            setSelectedaccountId={(id: string) => router.push(`/dashboard/canais-grupos/${id}`)}
            loadingaccounts={loadingaccounts}
          />
        )}
        {activeTab === "editar" && <EditarGrupoTab account={account} loadaccount={() => loadaccount(accountId)} />}
        {activeTab === "instagram" && <InstagramTab account={account} />}
        {activeTab === "shopee" && <ShopeeTab />}
        {activeTab === "layout" && <LayoutTab />}
        {activeTab === "instasched" && <InstaSchedTab />}
        {activeTab === "instabot" && <InstaBotHelpTab />}
        {activeTab === "aliexpress" && <AliExpressTab />}
        {activeTab === "amazon" && <AmazonTab />}
        {activeTab === "mercadolivre" && <MercadoLivreTab />}
        {activeTab === "shein" && <SheinTab />}
        {activeTab === "colaboradores" && <ColaboradoresTab />}
      </div>
    </div>
  )
}

function PostManualTab({
  account,
  loadaccount,
  accountsList,
  selectedaccountId,
  setSelectedaccountId,
  loadingaccounts
}: any) {
  const [interval, setInterval] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [postInLoop, setPostInLoop] = useState(false)
  const [random, setRandom] = useState(false)
  const [horaInicio, setHoraInicio] = useState("")
  const [horaFim, setHoraFim] = useState("")
  const [idioma, setIdioma] = useState("")
  const [moeda, setMoeda] = useState("")
  const [pais, setPais] = useState("")
  const [saving, setSaving] = useState(false)
  const [loadingConfig, setLoadingConfig] = useState(true)

  const [productLink, setProductLink] = useState("")
  const [keepLinkInPost, setKeepLinkInPost] = useState(true)
  const [header, setHeader] = useState("")
  const [footer, setFooter] = useState("")
  const [shopeeVideoLink, setShopeeVideoLink] = useState("")
  const [useShopeeVideo, setUseShopeeVideo] = useState(false)
  const [precoOriginal, setPrecoOriginal] = useState("")
  const [precoAtual, setPrecoAtual] = useState("")
  const [sufixoPreco, setSufixoPreco] = useState("")
  const [precoParcelado, setPrecoParcelado] = useState("")
  const [descricao, setDescricao] = useState("")
  const [agendamento, setAgendamento] = useState("")

  const [corTitulo, setCorTitulo] = useState("#000000")
  const [corPreco, setCorPreco] = useState("#FFFFFF")

  const [tipoCupom, setTipoCupom] = useState("")
  const [valorDesconto, setValorDesconto] = useState("")
  const [valorMinimo, setValorMinimo] = useState("")
  const [valorMaximo, setValorMaximo] = useState("")
  const [codigoCupom, setCodigoCupom] = useState("")

  useEffect(() => {
    if (selectedaccountId) loadConfig()
  }, [selectedaccountId])

  async function loadConfig() {
    setLoadingConfig(true)
    try {
      const res = await fetch(`/api/instagram/${selectedaccountId}/config`)
      const data = await res.json()

      if (data.id) {
        setInterval(data.interval?.toString() || "")
        setIsActive(data.isActive?? false)
        setPostInLoop(data.postInLoop?? false)
        setRandom(data.random?? false)
        setHoraInicio(data.horaInicio || "")
        setHoraFim(data.horaFim || "")
        setIdioma(data.idioma || "")
        setMoeda(data.moeda || "")
        setPais(data.pais || "")
        setProductLink(data.productLink || "")
        setKeepLinkInPost(data.keepLinkInPost?? true)
        setHeader(data.header || "")
        setFooter(data.footer || "")
        setShopeeVideoLink(data.shopeeVideoLink || "")
        setUseShopeeVideo(data.useShopeeVideo?? false)
        setPrecoOriginal(data.precoOriginal || "")
        setPrecoAtual(data.precoAtual || "")
        setSufixoPreco(data.sufixoPreco || "")
        setPrecoParcelado(data.precoParcelado || "")
        setDescricao(data.descricao || "")
        setAgendamento(data.agendamento || "")
        setCorTitulo(data.corTitulo || "#000000")
        setCorPreco(data.corPreco || "#FFFFFF")
        setTipoCupom(data.tipoCupom || "")
        setValorDesconto(data.valorDesconto || "")
        setValorMinimo(data.valorMinimo || "")
        setValorMaximo(data.valorMaximo || "")
        setCodigoCupom(data.codigoCupom || "")
      }
    } catch (e) {
      console.error(e)
      toast.error('Erro ao carregar configuração')
    } finally {
      setLoadingConfig(false)
    }
  }

  async function salvarConfig() {
    if (!selectedaccountId) {
      toast.error("Selecione uma conta primeiro")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/instagram/${selectedaccountId}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interval: interval? parseInt(interval) : null,
          isActive,
          postInLoop,
          random,
          horaInicio,
          horaFim,
          idioma,
          moeda,
          pais,
          productLink,
          keepLinkInPost,
          header,
          footer,
          shopeeVideoLink,
          useShopeeVideo,
          precoOriginal,
          precoAtual,
          sufixoPreco,
          precoParcelado,
          descricao,
          agendamento,
          corTitulo,
          corPreco,
          tipoCupom,
          valorDesconto,
          valorMinimo,
          valorMaximo,
          codigoCupom
        })
      })
      if (!res.ok) throw new Error("Erro ao salvar")
      toast.success("Configuração salva!")
      await loadaccount()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loadingConfig) return <div className="text-center py-8">Carregando configuração...</div>

  return (
    <>
      <div className="grid w-full gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          {/* SELECT DE CONTA INSTAGRAM */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-semibold uppercase text-gray-600">
              CONTA INSTAGRAM:
            </label>
            <select
              value={selectedaccountId}
              onChange={(e) => setSelectedaccountId(e.target.value)}
              disabled={loadingaccounts}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
            >
              <option value="">
                {loadingaccounts? 'Carregando...' : 'Selecione uma conta do Instagram'}
              </option>
              {accountsList?.map((ch: any) => (
                <option key={ch.id} value={ch.id}>
                  @{ch.username}
                </option>
                ))}
            </select>

            {!loadingaccounts && accountsList.length === 0 && (
              <p className="mt-2 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle size={14} />
                Nenhum conta do Instagram conectada.
                <Link href="/dashboard/canais-grupos" className="ml-1 font-semibold underline">
                  Conectar agora
                </Link>
              </p>
            )}
          </div>

          <div className="mb-9">
            <label className="mb-3 block text-xs font-semibold uppercase text-gray-600">
              LINK DO PRODUTO:
            </label>
            <div className="rounded bg-[#FFFDE7] px-3 py-2">
              <p className="text-xs font-bold text-[#F57C00]">
                ATENÇÃO! produtos adicionados via link, NÃO são atualizados automaticamente.
              </p>
            </div>
          </div>

          <div className="mb-3">
            <label className="mb-3 block text-xs font-semibold uppercase text-gray-600">
              LINK
            </label>
            <input
              type="text"
              value={productLink}
              onChange={(e) => setProductLink(e.target.value)}
              placeholder="https://shopee.com.br/..."
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-10">
            <label className="grid grid-cols-[16px_1fr] gap-2 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={keepLinkInPost}
                onChange={(e) => setKeepLinkInPost(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1976D2] focus:ring-[#1976D2]"
              />
              <span className="leading-snug">Manter esse link no post.</span>
            </label>
          </div>

          <div className="mb-10">
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
              CABEÇALHO DINÂMICO:
            </label>
            <input
              type="text"
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              placeholder="🔥 OFERTA IMPERDÍVEL!"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-10">
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
              RODAPÉ:
            </label>
            <input
              type="text"
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
              placeholder="Link nos comentários 👇"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
              LINK SHOPEE VÍDEO
            </label>
            <input
              type="text"
              value={shopeeVideoLink}
              onChange={(e) => setShopeeVideoLink(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-3">
            <label className="grid grid-cols-[16px_1fr] gap-2 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={useShopeeVideo}
                onChange={(e) => setUseShopeeVideo(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1976D2] focus:ring-[#1976D2]"
              />
              <span className="leading-snug">Link do vídeo do produto na Shopee, se preenchido, o sistema trocará o link original do produto pelo link do vídeo.</span>
            </label>
          </div>

          <div className="mb-10 rounded bg-[#FFF3E0] px-3 py-2">
            <p className="flex items-start gap-1.5 text-xs font-semibold text-[#E65100]">
              <AlertTriangle size={18} className="mt-0 shrink-0" />
              Atenção! Link da Shopee vídeo só funciona no celular.
            </p>
          </div>

          <div className="mb-10">
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
              PREÇO ORIGINAL:
            </label>
            <input
              type="text"
              value={precoOriginal}
              onChange={(e) => setPrecoOriginal(e.target.value)}
              placeholder="R$ 299,90"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-10">
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
              PREÇO ATUAL:
            </label>
            <input
              type="text"
              value={precoAtual}
              onChange={(e) => setPrecoAtual(e.target.value)}
              placeholder="R$ 199,90"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-10">
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
              SUFIXO DO PREÇO:
            </label>
            <input
              type="text"
              value={sufixoPreco}
              onChange={(e) => setSufixoPreco(e.target.value)}
              placeholder="à vista no Pix"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-10">
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
              PREÇO PARCELADO:
            </label>
            <input
              type="text"
              value={precoParcelado}
              onChange={(e) => setPrecoParcelado(e.target.value)}
              placeholder="12x de R$ 19,90"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-8">
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
              DESCRIÇÃO:
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              rows={3}
            />
            <p className="mt-1 text-xs text-gray-500">Essa descrição se aplica somente a esse produto cadastrado.</p>
          </div>

          <div className="mb-8">
            <label className="mb-3 block text-xs font-semibold uppercase text-gray-600">
              AGENDAMENTO
            </label>
            <input
              type="datetime-local"
              value={agendamento}
              onChange={(e) => setAgendamento(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-3 text-xs text-gray-500">Selecione a Data e Hora</p>
          </div>
        </div>

        {/* COLUNA DIREITA - CONFIGURAÇÕES */}
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-3.5">
              <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-600">
                CONFIGURAÇÃO:
              </label>
              <div className="space-y-2">
                <label className="grid grid-cols-[16px_1fr] gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1976D2] focus:ring-[#1976D2]"
                  />
                  <span>Post automático</span>
                </label>
                <label className="grid grid-cols-[16px_1fr] gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={postInLoop}
                    onChange={(e) => setPostInLoop(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1976D2] focus:ring-[#1976D2]"
                  />
                  <span>Post em Loop</span>
                </label>
                <label className="grid grid-cols-[16px_1fr] gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={random}
                    onChange={(e) => setRandom(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1976D2] focus:ring-[#1976D2]"
                  />
                  <span>Ordem aleatória</span>
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">Repete os produtos ao final da lista.</p>
            </div>

            <div className="mb-3.5">
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                POST INTERVALO (MINUTOS)
              </label>
              <input
                type="number"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                placeholder="120"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="mb-3.5">
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                HORA INÍCIO
              </label>
              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="mb-3.5">
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                HORA FIM
              </label>
              <input
                type="time"
                value={horaFim}
                onChange={(e) => setHoraFim(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="mb-3.5">
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                IDIOMA
              </label>
              <select
                value={idioma}
                onChange={(e) => setIdioma(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Selecione o idioma</option>
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="zh">中文</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">Título de produtos do AliExpress</p>
            </div>

            <div className="mb-3.5">
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                MOEDA
              </label>
              <select
                value={moeda}
                onChange={(e) => setMoeda(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Selecione a moeda</option>
                <option value="BRL">Real (BRL)</option>
                <option value="USD">Dólar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="CNY">Yuan (CNY)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">Valor de produtos do AliExpress</p>
            </div>

            <div className="mb-3.5">
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                PAÍS
              </label>
              <select
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Selecione o país</option>
                <option value="BR">Brasil</option>
                <option value="US">Estados Unidos</option>
                <option value="CN">China</option>
                <option value="ES">Espanha</option>
                <option value="MX">México</option>
                <option value="AR">Argentina</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">país para envio (send to)</p>
            </div>

            <button
              onClick={salvarConfig}
              disabled={saving ||!selectedaccountId}
              className="mt-4 w-full rounded bg-[#1976D2] py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-gray-300"
            >
              {saving? "Salvando..." : "Salvar"}
            </button>
          </div>

          {/* CARD CUPONS */}
          <div className="w-full rounded-lg border border-gray-200 bg-white">
            <div className="rounded-t-lg bg-[#29B6F6] px-4 py-2.5">
              <h4 className="text-sm font-semibold text-white">Cupons</h4>
            </div>
            <div className="space-y-3.5 p-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                  TIPO DE CUPOM
                </label>
                <select
                  value={tipoCupom}
                  onChange={(e) => setTipoCupom(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Selecione o tipo de cupom</option>
                  <option value="porcentagem">Porcentagem</option>
                  <option value="valor_fixo">Valor Fixo</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                  VALOR DO DESCONTO
                </label>
                <input
                  type="text"
                  value={valorDesconto}
                  onChange={(e) => setValorDesconto(e.target.value)}
                  placeholder="Ex: 10 ou 50"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">Digite apenas números inteiros.</p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                  VALOR MÍNIMO DA COMPRA PARA APLICAR O CUPOM
                </label>
                <input
                  type="text"
                  value={valorMinimo}
                  onChange={(e) => setValorMinimo(e.target.value)}
                  placeholder="Ex: 50 ou 100"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">Digite apenas números inteiros.</p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                  VALOR MÁXIMO DO CUPOM
                </label>
                <input
                  type="text"
                  value={valorMaximo}
                  onChange={(e) => setValorMaximo(e.target.value)}
                  placeholder="Ex: 100 ou 200"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">Digite apenas números inteiros.</p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                  CÓDIGO DO CUPOM
                </label>
                <input
                  type="text"
                  value={codigoCupom}
                  onChange={(e) => setCodigoCupom(e.target.value)}
                  placeholder="Ex: CUPOM15"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={salvarConfig}
                  disabled={saving}
                  className="rounded bg-[#1976D2] px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-gray-300"
                >
                  Salvar
                </button>
                <button
                  onClick={salvarConfig}
                  disabled={saving}
                  className="rounded bg-[#388E3C] px-5 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:bg-gray-300"
                >
                  Salvar e Postar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TEMPLATES */}
      <div className="grid w-full items-start gap-4 lg:grid-cols-2 mt-4">
        <div className="w-full rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-3">
            <h4 className="text-sm font-semibold text-gray-900">Template Stories (16:9):</h4>
          </div>
          <div className="p-4">
            <div className="mb-3 rounded bg-[#E0F7FA] px-3 py-2 text-center text-xs font-semibold text-[#00ACC1]">
              CLIQUE AQUI para editar esse template no CANVA.
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                ESCOLHA UMA IMAGEM DA PASTA
              </label>

              <select
                value={selectedTemplateUrl}
                onChange={(e) => setSelectedTemplateUrl(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Selecione uma imagem</option>

                {templateImages.map((img) => (
                  <option key={img.url} value={img.url}>
                    {img.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                COR DO TÍTULO
              </label>
              <label className="relative inline-block h-7 w-7 cursor-pointer overflow-hidden rounded border border-gray-300">
                <div
                  className="h-full w-full"
                  style={{ backgroundColor: corTitulo }}
                />
                <input
                  type="color"
                  value={corTitulo}
                  onChange={(e) => setCorTitulo(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </label>
            </div>

            <div className="mb-2">
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                COR DO PREÇO
              </label>
              <label className="relative inline-block h-7 w-7 cursor-pointer overflow-hidden rounded border border-gray-300">
                <div
                  className="h-full w-full"
                  style={{ backgroundColor: corPreco }}
                />
                <input
                  type="color"
                  value={corPreco}
                  onChange={(e) => setCorPreco(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </label>
            </div>

            <button
              onClick={salvarConfig}
              className="mb-3 rounded bg-[#1976D2] px-6 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
              Salvar
            </button>

            <div className="rounded border border-gray-200 p-2">
              <img src="https://via.placeholder.com/300x500/0088cc/ffffff?text=Template+Story" alt="Template Stories" className="w-full rounded" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-3">
            <h4 className="text-sm font-semibold text-gray-900">Template Feed (1:1):</h4>
          </div>
          <div className="p-4">
            <div className="mb-5 rounded bg-[#E0F7FA] px-3 py-2 text-center text-xs font-semibold text-[#00ACC1]">
              CLIQUE AQUI para editar esse template no CANVA.
            </div>

            <div className="mb-8">
              <label className="mb-8 block text-xs font-semibold uppercase text-gray-600">
                ESCOLHA UM ARQUIVO
              </label>
              <div className="flex gap-2">
                <button className="rounded border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-70">
                  Escolher arquivo
                </button>
                <span className="py-1.5 text-xs text-gray-500">Nenhum arquivo escolhido</span>
              </div>
            </div>

            <button
              onClick={salvarConfig}
              className="mb-8 rounded bg-[#1976D2] px-6 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
              Salvar
            </button>

            <div className="rounded border border-gray-200 p-2">
              <img src="https://via.placeholder.com/300x300/0088cc/ffffff?text=Template+Feed" alt="Template Feed" className="w-full rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-full mt-6 text-center text-xs text-gray-400">
        © 2026
      </div>
    </>
  )
}

function EditarGrupoTab({ account, loadaccount }: any) {
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [avatar, setAvatar] = useState("")
  const [interval, setInterval] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (account) {
      setName(account.username || "")
      setAvatar(account.profilePicture || "")
      setIsActive(account.isActive?? false)
    }
  }, [account])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAvatar(data.url)
      toast.success("Foto carregada")
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setUploading(false)
    }
  }

  async function salvar() {
    setSaving(true)
    try {
      const res = await fetch(`/api/instagram/${account.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          profilePicture: avatar,
          isActive
        })
      })
      if (!res.ok) throw new Error("Erro ao salvar")
      toast.success("Salvo com sucesso!")
      setModalOpen(false)
      await loadaccount()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100">
            {account?.profilePicture? (
              <img src={account.profilePicture} alt={account.username} className="h-full w-full object-cover" />
            ) : (
              <Instagram size={32} className="text-pink-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">@{account?.username || "Carregando..."}</h3>
            <p className="text-sm text-gray-500">
              Status: <span className={account?.isActive? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {account?.isActive? "Ativo" : "Inativo"}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              {account?.followersCount?.toLocaleString('pt-BR')} seguidores
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded bg-[#1976D2] py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          <Edit size={18} />
          Editar Conta
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
              <h3 className="text-base font-semibold text-gray-900">Editar Conta Instagram</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium uppercase text-gray-700">
                  FOTO DO PERFIL
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                    {avatar? (
                      <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <Instagram size={28} className="text-pink-600" />
                    )}
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Upload size={16} />
                    {uploading? "Enviando..." : "Trocar Foto"}
                    <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase text-gray-700">
                  USERNAME
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <label className="grid grid-cols-[16px_1fr] gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#1976D2] focus:ring-[#1976D2]"
                />
                <span className="text-sm font-medium text-gray-700">
                  Postagem automática ativa
                </span>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvar}
                  disabled={saving}
                  className="flex-1 rounded bg-[#1976D2] py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {saving? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function InstagramTab({ account }: any) {
  const [postAuto, setPostAuto] = useState(false)
  const [desativarComentario, setDesativarComentario] = useState(false)
  const [agendamentoAtivo, setAgendamentoAtivo] = useState(false)
  const [diasSemana, setDiasSemana] = useState({
    dom: false, seg: false, ter: false, qua: false, qui: false, sex: false, sab: false
  })
  const [horarios, setHorarios] = useState<{[key: number]: boolean}>({
    0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false,
    8: false, 9: false, 10: false, 11: false, 12: false, 13: false, 14: false, 15: false,
    16: false, 17: false, 18: false, 19: false, 20: false, 21: false, 22: false, 23: false
  })

  const [templateImages, setTemplateImages] = useState<any[]>([])
  const [driveImages, setDriveImages] = useState<any[]>([])
  const [selectedTemplateUrl, setSelectedTemplateUrl] = useState("")

  const [textoRespostaStory, setTextoRespostaStory] = useState(
    "Olá, que bom que você gostou desse produto!"
  )

  const [textoBotaoLink, setTextoBotaoLink] = useState(
    "VER NA LOJA"
  )
  

  useEffect(() => {
    async function loadConfig() {
      const res = await fetch(
        `/api/instagram/config?instagramAccountId=${account.id}`
      );

      const data = await res.json();

      setPostAuto(data.postAuto || false);
      setDesativarComentario(data.desativarComentario || false);
      setAgendamentoAtivo(data.agendamentoAtivo || false);

      setSelectedTemplateUrl(data.storyTemplateUrl || "");

      setTextoRespostaStory(
        data.textoRespostaStory ||
        "Olá, que bom que você gostou desse produto!"
      );

      setTextoBotaoLink(
        data.textoBotaoLink || "VER NA LOJA"
      );

      if (data.diasSelecionados) {
        const diasObj: any = {};

        data.diasSelecionados.forEach((d: string) => {
          diasObj[d] = true;
        });

        setDiasSemana((prev) => ({
          ...prev,
          ...diasObj,
        }));
      }

      if (data.horariosSelecionados) {
        const horasObj: any = {};

        data.horariosSelecionados.forEach((h: number) => {
          horasObj[h] = true;
        });

        setHorarios((prev) => ({
          ...prev,
          ...horasObj,
        }));
      }
    }

    loadConfig();
  }, [account.id]);

  
  const toggleDia = (dia: string) => {
    setDiasSemana(prev => ({...prev, [dia]: !prev[dia as keyof typeof prev] }))
  }

  const toggleHora = (hora: number) => {
    setHorarios(prev => ({...prev, [hora]: !prev[hora] }))
  }

  // 👇 COLE A ETAPA 4 AQUI
  async function salvarConfiguracoes() {
    const diasSelecionados = Object.keys(diasSemana)
      .filter((dia) => diasSemana[dia as keyof typeof diasSemana])

    const horariosSelecionados = Object.keys(horarios)
      .filter((hora) => horarios[Number(hora)])
      .map(Number)

    await fetch("/api/instagram/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instagramAccountId: account.id,

        postAuto,
        desativarComentario,
        agendamentoAtivo,

        storyTemplateUrl: selectedTemplateUrl,

        diasSelecionados,
        horariosSelecionados,
      }),
    })

    alert("Configurações salvas!")
  }

  // Dados do Instagram - troque por API real depois
  const instagramData = {
    username: account?.name?.toLowerCase().replace(/\s+/g, '.') || "usuario",
    nome: account?.name || "Canal",
    seguidores: 0,
    seguindo: 0,
    posts: 0,
    conectado: false
  }

  return (
    <>
      <div className="w-full rounded-lg bg-gradient-to-r from-[#833AB4] via-[#FD1D] to-[#F77737] px-5 py-4 text-white">
        <div className="flex items-center gap-2">
          <Instagram size={20} />
          <div>
            <h3 className="text-base font-bold">Instagram</h3>
            <p className="mt-1 text-xs text-white/90">
              Configurações da conta @{instagramData.username}
            </p>
          </div>
        </div>
      </div>

      <div className="grid w-full gap-4 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
              <Link2 size={16} className="text-gray-600" />
              <h4 className="text-sm font-semibold text-gray-900">Conta Vinculada</h4>
            </div>
            
            <div className="p-4">
              <div className="mb-4 rounded-lg bg-[#FFF3F8] p-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={account?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(instagramData.nome)}`}
                    alt={instagramData.nome} 
                    className="h-12 w-12 rounded-full object-cover" 
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{instagramData.username}</p>
                    <p className="text-xs text-gray-600">{instagramData.nome}</p>
                  </div>
                </div>
              </div>

              <div className="mb-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">{instagramData.posts}</p>
                  <p className="text-xs text-gray-500">Mídias</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{instagramData.seguidores}</p>
                  <p className="text-xs text-gray-500">Seguidores</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{instagramData.seguindo}</p>
                  <p className="text-xs text-gray-500">Seguindo</p>
                </div>
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded border-[#E53935] py-2 text-sm font-semibold text-[#E53935] hover:bg-red-50">
                <Unlink size={14} />
                {instagramData.conectado? "Desconectar Instagram" : "Conectar Instagram"}
              </button>
            </div>
          </div>

          <div className="w-full rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
              <ImageIcon size={16} className="text-gray-600" />
              <h4 className="text-sm font-semibold text-gray-900">Template IG Story (16:9)</h4>
            </div>
            
            <div className="p-4">
              <div className="mb-3 rounded bg-[#E0F7FA] p-2 text-center text-xs font-semibold text-[#00ACC1]">
                Clique aqui para editar o template no Canva.
              </div>

              <div className="mb-3">
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                  ESCOLHA UMA IMAGEM SALVA NO DRIVE
                </label>

                <select
                  value={selectedTemplateUrl}
                  onChange={(e) => setSelectedTemplateUrl(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Selecione uma imagem</option>

                  {driveImages.map((img) => (
                    <option key={img.id} value={img.url}>
                      {img.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3 flex items-end gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                    COR DO TÍTULO
                  </label>
                  <div className="h-8 w-8 rounded border border-gray-300 bg-black"></div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                    COR DO PREÇO
                  </label>
                  <div className="h-8 w-8 rounded border border-gray-300 bg-white"></div>
                </div>
                <button className="ml-auto rounded bg-gradient-to-r from-[#833AB4] to-[#FD1D] px-6 py-2 text-sm font-bold text-white">
                  Salvar
                </button>
              </div>

              <div className="rounded border border-gray-200 p-2">
                {selectedTemplateUrl ? (
                  <img
                    src={selectedTemplateUrl}
                    alt="Template selecionado"
                    className="w-full rounded"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center rounded bg-gray-100 text-sm text-gray-500">
                    Nenhum template selecionado
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
              <MessageSquare size={16} className="text-gray-600" />
              <h4 className="text-sm font-semibold text-gray-900">Resposta Automática do Story</h4>
            </div>
            
            <div className="p-4">
              <div className="mb-4 rounded bg-[#FFF9C4] px-3 py-2">
                <p className="flex items-start gap-1.5 text-xs text-[#F57F17]">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  Não há compatibilidade com figurinhas (links, enquetes, localização).
                </p>
                <p className="mt-1.5 flex items-start gap-1.5 text-xs text-[#F57F17]">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  O template deve conter a chamada: "Comente QUERO para receber o link!"
                </p>
              </div>

              <div className="mb-4 flex items-center gap-6">
                <button
                  onClick={() => setPostAuto(!postAuto)}
                  className="flex items-center gap-2"
                >
                  <div className={`relative h-6 w-11 rounded-full transition ${postAuto? 'bg-[#1976D2]' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${postAuto? 'left-5.5' : 'left-0.5'}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Post automático</span>
                </button>

                <button
                  onClick={() => setDesativarComentario(!desativarComentario)}
                  className="flex items-center gap-2"
                >
                  <div className={`relative h-6 w-11 rounded-full transition ${desativarComentario? 'bg-[#1976D2]' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${desativarComentario? 'left-5.5' : 'left-0.5'}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">DESATIVAR RESPOSTA NO COMENTÁRIO</span>
                </button>
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-600">
                  TEXTO DA RESPOSTA AUTOMÁTICA AO STORY
                </label>
                <textarea
                  value={textoRespostaStory}
                  onChange={(e) => setTextoRespostaStory(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  rows={3}
                />
                <p className="mt-1 text-xs text-gray-500">Limite de 500 caracteres, use \n para quebra de linha</p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-600">
                  TEXTO DO BOTÃO DE LINK
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={textoBotaoLink}
                    onChange={(e) => setTextoBotaoLink(e.target.value)}
                    className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                 <button
                    onClick={salvarConfiguracoes}
                    className="rounded bg-gradient-to-r from-[#833AB4] to-[#FD1D] px-6 py-2 text-sm font-bold text-white"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="w-full rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
              <TrendingUp size={16} className="text-gray-600" />
              <h4 className="text-sm font-semibold text-gray-900">Crescimento de Seguidores</h4>
            </div>
            <div className="p-8 text-center">
              <TrendingUp size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-xs text-gray-500">Dados insuficientes para o gráfico. Tente novamente em alguns dias.</p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
              <Calendar size={16} className="text-gray-600" />
              <h4 className="text-sm font-semibold text-gray-900">Agendamento Recorrente do Story</h4>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="mb-2 flex items-center gap-1 text-xs font-bold uppercase text-gray-600">
                  <Calendar size={12} />
                  DIAS DA SEMANA
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'dom', label: 'Domingo' },
                    { key: 'seg', label: 'Segunda' },
                    { key: 'ter', label: 'Terça' },
                    { key: 'qua', label: 'Quarta' },
                    { key: 'qui', label: 'Quinta' },
                    { key: 'sex', label: 'Sexta' },
                    { key: 'sab', label: 'Sábado' },
                  ].map((dia) => (
                    <button
                      key={dia.key}
                      onClick={() => toggleDia(dia.key)}
                      className={`flex w-full items-center justify-start gap-1.5 rounded px-2 py-1.5 text-xs font-medium ${
                        diasSemana[dia.key as keyof typeof diasSemana]
                        ? "bg-[#29B6F6] text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Eye size={14} />
                      {dia.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 flex items-center gap-1 text-xs font-bold uppercase text-gray-600">
                  <Calendar size={12} />
                  HORÁRIOS (HORA CHEIA)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map((hora) => (
                    <button
                      key={hora}
                      onClick={() => toggleHora(hora)}
                      className={`flex w-full items-center justify-start gap-1 rounded px-2 py-1.5 text-xs font-medium ${
                        horarios[hora]
                        ? "bg-[#29B6F6] text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Eye size={12} />
                      {hora}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3 flex items-center gap-2">
                <button
                  onClick={() => setAgendamentoAtivo(!agendamentoAtivo)}
                  className="flex items-center gap-2"
                >
                  <div className={`relative h-6 w-11 rounded-full transition ${agendamentoAtivo? 'bg-[#29B6F6]' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${agendamentoAtivo? 'left-5.5' : 'left-0.5'}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Ativo?</span>
                </button>
              </div>

              <button
                onClick={salvarConfiguracoes}
                className="flex w-full items-center justify-center gap-2 rounded bg-gradient-to-r from-[#833AB4] to-[#FD1D1D] py-2.5 text-sm font-bold text-white"
              >
                Salvar Agendamento
              </button>
            </div>
          </div>

          <div className="w-full rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-4 py-3">
              <h4 className="text-xs font-bold uppercase text-gray-600">DICAS</h4>
            </div>
            <div className="space-y-2 p-4">
              {[
                'Contas do Instagram podem publicar até 25 posts automáticos por 24 horas.',
                'O template do Story deve ter proporção 9:16 (1080×1920px).',
                'Use o agendamento recorrente para manter seus stories ativos automaticamente.',
                'Se o Instagram desconectar, reconecte usando 4G ao invés do Wi-Fi.',
              ].map((dica, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#4CAF50]" />
                  <p className="text-xs leading-relaxed text-gray-600">{dica}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-full mt-6 text-center text-xs text-gray-400">
        © 2026
      </div>
    </>
  )
}

function ShopeeTab() {
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [produtosExibir, setProdutosExibir] = useState('12')
  const [pesquisar, setPesquisar] = useState('')
  const [ordenarPor, setOrdenarPor] = useState('Data Atualização - Mais Novos')
  const [acaoMassa, setAcaoMassa] = useState('')
  const [todosMarcados, setTodosMarcados] = useState(false)
  const [categoria, setCategoria] = useState('')
  const [palavrasChave, setPalavrasChave] = useState('')
  const [linkShopeeVideo, setLinkShopeeVideo] = useState('')
  const [cabecalho, setCabecalho] = useState('')
  const [rodape, setRodape] = useState('')
  
  return (
    <>
      <div className="w-full grid gap-4 lg:grid-cols-3">
        {/* CARD 1: Add produtos Shopee */}
        <div className="w-full rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-3">
            <h4 className="text-sm font-semibold text-gray-900">Add produtos Shopee</h4>
          </div>
          <div className="space-y-3.5 p-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                CATEGORIA
              </label>
              <select 
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Selecione uma categoria</option>
                <option value="moda">Moda</option>
                <option value="casa">Casa e Decoração</option>
                <option value="eletronicos">Eletrônicos</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                PALAVRAS CHAVE
              </label>
              <input
                type="text"
                value={palavrasChave}
                onChange={(e) => setPalavrasChave(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
              
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                LINK SHOPEE VIDEO
              </label>
              <input 
                type="text"
                value={linkShopeeVideo}
                onChange={(e) => setLinkShopeeVideo(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs leading-relaxed text-gray-600">
                Link do vídeo do produto na Shopee, se preenchido, o sistema trocará o link original do produto pelo link do vídeo.
              </p>

              <div className="mt-2 rounded bg-[#FFF3E0] px-3 py-2">
                <p className="flex items-start gap-1.5 text-xs text-[#E65100]">
                  <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                  Atenção! Link da Shopee vídeo só funciona no celular.
                </p>
                <p className="mt-1 text-xs text-[#E65100]">
                  Ex: https://shp.ee/ejollie57smtt=0.0.9
                </p>
              </div>
            </div>

            <button className="w-full rounded bg-[#1976D2] py-2 text-sm font-bold text-white hover:bg-blue-700">
              Salvar
            </button>
          </div>
        </div>

        {/* CARD 2: Texto padrão Shopee */}
        <div className="w-full rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-3">
            <h4 className="text-sm font-semibold text-gray-900">Texto padrão Shopee</h4>
          </div>
          <div className="space-y-3.5 p-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                CABEÇALHO DO SHOPEE
              </label>
              <textarea
                value={cabecalho}
                onChange={(e) => setCabecalho(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                rows={3}
              />
              <p className="mt-1 text-xs text-gray-500">
                Esse texto será exibido acima do título de um produto do Shopee. Substitui o cabeçalho geral
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                RODAPÉ DO SHOPEE
              </label>
              <textarea
                value={rodape}
                onChange={(e) => setRodape(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                rows={3}
              />
              <p className="mt-1 text-xs text-gray-500">
                Esse texto será exibido no final do post de um produto do Shopee. Substitui o rodapé geral
              </p>
            </div>

            <button className="w-full rounded bg-[#1976D2] py-2 text-sm font-bold text-white hover:bg-blue-700">
              Salvar
            </button>
          </div>
        </div>

        {/* CARD 3: Importar Produtos em Massa */}
        <div className="w-full rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-3">
            <h4 className="text-sm font-semibold text-gray-900">Importar Produtos em Massa</h4>
          </div>
          <div className="space-y-3 p-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                ARQUIVO DE PRODUTOS.CSV
              </label>
              <div className="flex gap-2">
                <label className="cursor-pointer rounded border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-70">
                  Escolher arquivo
                  <input 
                    type="file" 
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                  />
                </label>
                <span className="py-1.5 text-xs text-gray-500">
                  {arquivo? arquivo.name : 'Nenhum arquivo escolhido'}
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-gray-600">
              O arquivo CSV deve ter as seguintes colunas na ordem: Item Id, Item Name, Price, Sales, Shop Name, Commission Rate, Commission, Product Link, Offer Link.
            </p>

            <button className="rounded bg-[#1976D2] px-6 py-2 text-sm font-bold text-white hover:bg-blue-700">
              Importar
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="w-full mt-4 border-t border-gray-200 pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={pesquisar}
            onChange={(e) => setPesquisar(e.target.value)}
            placeholder="Pesquisar"
            className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button className="rounded bg-[#2196F3] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#1976D2]">
            Pesquisar
          </button>
        </div>
      </div>

      {/* Filtros Produtos */}
      <div className="w-full mt-4 border-t border-gray-200 pt-4">
        <div className="mb-2 flex items-center gap-4">
          <label className="text-xs font-semibold text-gray-700">Produtos</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Exibir:</span>
            <select
              value={produtosExibir}
              onChange={(e) => setProdutosExibir(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
            >
              <option>12</option>
              <option>24</option>
              <option>48</option>
              <option>96</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Ordenar por:</span>
            <select
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
            >
              <option>Data Atualização - Mais Novos</option>
              <option>Data Atualização - Mais Antigos</option>
              <option>Preço - Menor</option>
              <option>Preço - Maior</option>
              <option>Comissão - Maior</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-gray-700">
            <input
              type="checkbox"
              checked={todosMarcados}
              onChange={(e) => setTodosMarcados(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-gray-300"
            />
            Todos
          </label>
          <select
            value={acaoMassa}
            onChange={(e) => setAcaoMassa(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
          >
            <option value="">Selecione uma ação</option>
            <option value="deletar">Deletar Selecionados</option>
            <option value="exportar">Exportar Selecionados</option>
          </select>
          <button 
            disabled={!acaoMassa}
            className="rounded bg-[#2196F3] px-4 py-1 text-xs font-bold text-white hover:bg-[#1976D2] disabled:opacity-50"
          >
            Executar
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-400">
        © 2026
      </div>
    </>
  )
}

function LayoutTab() {
  return (
    <div className="w-full grid items-start gap-4 lg:grid-cols-[2fr_1fr]">
      {/* Coluna Esquerda - Configuração */}
      <div className="w-full rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-600">
            Configuração:
          </label>
          <label className="grid grid-cols-[16px_1fr] gap-2 text-sm text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1976D2] focus:ring-[#1976D2]" 
            />
            <span>WHATSAPP: ENVIAR IMAGEM COMO PREVIEW (link card)</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
            CABEÇALHO GERAL
          </label>
          <textarea 
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
            rows={2} 
          />
          <p className="mt-1 text-xs text-gray-500">Esse texto será exibido acima do título do produto</p>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
            TEXTO DO TÍTULO
          </label>
          <textarea 
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
            rows={2} 
          />
          <p className="mt-1 text-xs text-gray-500">
            Exemplo: 🔥🔥 <b>{'{title}'}</b> 🔥🔥
          </p>
        </div>

        <div className="mb-4 space-y-2">
          <label className="grid grid-cols-[16px_1fr] gap-2 text-sm text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1976D2] focus:ring-[#1976D2]" 
            />
            <span>TÍTULO EM MAIÚSCULO</span>
          </label>
          <label className="grid grid-cols-[16px_1fr] gap-2 text-sm text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1976D2] focus:ring-[#1976D2]" 
            />
            <span>OCULTAR TEXTO DE VENDAS</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
            TEXTO DE VENDAS
          </label>
          <textarea 
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
            rows={2} 
          />
          <p className="mt-1 text-xs text-gray-500">
            Exemplo: 🛒🛒 <i>{'{vendas}'}</i> pedidos <i>{'{/i}'}</i> 🛒🛒
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
            TEXTO DA DESCRIÇÃO
          </label>
          <textarea 
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
            rows={2} 
          />
          <p className="mt-1 text-xs text-gray-500">
            Exemplo: {'<pre>'} {'{description}'} {'</pre>'}
          </p>
        </div>

        <div className="mb-4">
          <label className="grid grid-cols-[16px_1fr] gap-2 text-sm text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1976D2] focus:ring-[#1976D2]" 
            />
            <span>OCULTAR VALOR ORIGINAL</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
            TEXTO DO PREÇO ORIGINAL
          </label>
          <textarea 
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
            rows={2} 
          />
          <p className="mt-1 text-xs text-gray-500">
            Exemplo: <span className="text-red-500">❌❌</span> <s>{'{price_original}'}</s> <span className="text-red-500">❌❌</span>
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
            TEXTO DO PARCELAMENTO
          </label>
          <textarea 
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
            rows={2} 
          />
          <p className="mt-1 text-xs text-gray-500">
            Exemplo: 💳💳 {'{parcelamento}'} 💳💳
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
            TEXTO DO PREÇO ATUAL
          </label>
          <textarea 
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
            rows={2} 
          />
          <p className="mt-1 text-xs text-gray-500">
            Exemplo: 💰💰 <b>{'{price}'}</b> 💰💰
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
            TEXTO DO LINK DE AFILIADO
          </label>
          <textarea 
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
            rows={2} 
          />
          <p className="mt-1 text-xs text-gray-500">
            Exemplo: 🔗🔗 {'{link}'} 🔗🔗
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
            RODAPÉ GERAL
          </label>
          <textarea 
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
            rows={2} 
          />
          <p className="mt-1 text-xs text-gray-500">Esse texto será exibido ao final de todos os posts.</p>
        </div>

        <button className="rounded bg-[#1976D2] px-6 py-2 text-sm font-bold text-white hover:bg-blue-700">
          Salvar
        </button>
      </div>

      {/* Coluna Direita - Dicas de formatação */}
      <div className="w-full rounded-lg border border-gray-200 bg-white p-4">
        <h4 className="mb-3 text-xs font-semibold uppercase text-gray-600">
          Dicas de formatação:
        </h4>
        <div className="space-y-1.5 rounded border-gray-200 bg-gray-50 p-3 font-mono text-xs">
          <div>
            <span className="font-semibold text-gray-900">negrito</span>
            <div className="text-gray-600">{'<b>negrito</b>'}</div>
          </div>
          <div>
            <span className="font-semibold text-gray-900">itálico</span>
            <div className="text-gray-600">{'<i>itálico</i>'}</div>
          </div>
          <div>
            <span className="font-semibold text-gray-900">sublinhado</span>
            <div className="text-gray-600">{'<u>sublinhado</u>'}</div>
          </div>
          <div>
            <span className="font-semibold text-gray-900">riscado</span>
            <div className="text-gray-600">{'<s>riscado</s>'}</div>
          </div>
          <div>
            <span className="font-semibold text-gray-900">spoiler</span>
            <div className="text-gray-600">{'<span class="tg-spoiler">spoiler</span>'}</div>
          </div>
          <div>
            <span className="font-semibold text-gray-900">codigo de largura fixa inline</span>
            <div className="text-gray-600">{'<code>codigo de largura fixa inline</code>'}</div>
          </div>
          <div>
            <span className="font-semibold text-gray-900">bloco de código de largura fixa pré-formatado</span>
            <div className="text-gray-600">{'<pre>bloco de código de largura fixa pré-formatado</pre>'}</div>
          </div>
        </div>
      </div>
      
      <div className="col-span-full mt-6 text-center text-xs text-gray-400">
        © 2026
      </div>
    </div>
  )
}

function InstaSchedTab() {
  const [posts, setPosts] = useState<any[]>([]) // <- Começa vazio
  const [pagina, setPagina] = useState(1)
  const itensPorPagina = 12
  const totalPaginas = Math.ceil(posts.length / itensPorPagina)

  const postsPaginados = posts.slice(
    (pagina - 1) * itensPorPagina,
    pagina * itensPorPagina
  )

  const deletarPost = (id: number) => {
    setPosts(posts.filter(p => p.id !== id))
  }

  return (
    <>
      {/* Banner Gradient Laranja/Roxo */}
      <div className="w-full rounded-lg bg-gradient-to-r from-[#FF6B35] via-[#F7931E] to-[#833AB4] px-5 py-3">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <div>
              <h3 className="text-sm font-bold">Agendamentos Instagram</h3>
              <p className="text-xs opacity-90">@viciados.na.shoppee - Até 25 posts automáticos por 24 horas</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 rounded bg-white px-4 py-1.5 text-xs font-bold text-[#FF6B35] hover:bg-gray-100">
            <Plus size={14} />
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Se não tiver posts, mostra estado vazio */}
      {posts.length === 0 ? (
        <div className="w-full mt-8 rounded-lg border border-gray-200 bg-white py-16 text-center">
          <Calendar size={48} className="mx-auto mb-3 text-gray-300" />
          <h4 className="mb-1 text-sm font-semibold text-gray-900">
            Nenhum agendamento encontrado
          </h4>
          <p className="mb-4 text-xs text-gray-500">
            Você ainda não criou nenhum agendamento. Clique em "Novo Agendamento" para começar.
          </p>
          <button className="inline-flex items-center gap-1.5 rounded bg-[#1976D2] px-5 py-2 text-sm font-bold text-white hover:bg-blue-700">
            <Plus size={16} />
            Criar Primeiro Agendamento
          </button>
        </div>
      ) : (
        <>
          {/* Grid de Posts */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {postsPaginados.map((post) => (
              <div key={post.id} className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="relative">
                  <img 
                    src={post.img} 
                    alt={post.titulo}
                    className="h-48 w-full rounded-t-lg object-cover"
                  />
                  <div className={`absolute left-2 top-2 rounded px-2 py-0.5 text-xs font-bold text-white ${
                    post.status === 'Publicado' ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'
                  }`}>
                    {post.status}
                  </div>
                </div>
                
                <div className="p-2.5">
                  <p className="mb-1 line-clamp-2 text-xs font-semibold text-gray-900">
                    {post.titulo}
                  </p>
                  <p className="mb-2 text-sm font-bold text-[#1976D2]">
                    R$ {post.preco}
                  </p>
                  
                  <div className="mb-2 flex items-center gap-1 text-xs text-gray-600">
                    {post.status === 'Publicado' ? (
                      <CheckCircle2 size={12} className="text-[#22C55E]" />
                    ) : (
                      <Clock size={12} className="text-[#F59E0B]" />
                    )}
                    <span className="text-xs">{post.status}</span>
                  </div>
                  
                  <p className="mb-2 flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    {post.data}
                  </p>

                  <div className="flex gap-1.5">
                    <button className={`flex flex-1 items-center justify-center gap-1 rounded border py-1.5 text-xs font-semibold ${
                      post.status === 'Publicado' 
                        ? 'border-[#1976D2] text-[#1976D2] hover:bg-blue-50' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}>
                      {post.status === 'Publicado' ? (
                        <>
                          <ExternalLink size={12} />
                          Ver
                        </>
                      ) : (
                        <>
                          <Pencil size={12} />
                          Editar
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => deletarPost(post.id)}
                      className="rounded border border-red-300 px-2 py-1.5 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="mt-4 flex items-center justify-center gap-1">
              <button 
                onClick={() => setPagina(Math.max(1, pagina - 1))}
                disabled={pagina === 1}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                « Previous
              </button>
              {[...Array(totalPaginas)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPagina(i + 1)}
                  className={`rounded px-3 py-1 text-xs font-semibold ${
                    pagina === i + 1
                      ? 'bg-[#1976D2] text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setPagina(Math.min(totalPaginas, pagina + 1))}
                disabled={pagina === totalPaginas}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next »
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-6 text-center text-xs text-gray-400">
        © 2026
      </div>
    </>
  )
}

function InstaBotHelpTab() {
  const [activeSubTab, setActiveSubTab] = useState<'reels' | 'remix'>('reels')
  const [modalAberto, setModalAberto] = useState(false)
  const [postSelecionado, setPostSelecionado] = useState<any>(null)
  
  // Modal states
  const [palavraChave, setPalavraChave] = useState('')
  const [fraseResposta, setFraseResposta] = useState('')
  const [textoDirect, setTextoDirect] = useState('Olá! Aqui está o link que vc me pediu lá nos comentários:')
  const [textoDestaque, setTextoDestaque] = useState('👉 CLIQUE AQUI 👈')
  const [linkAfiliado, setLinkAfiliado] = useState('')
  const [links, setLinks] = useState<{ nome: string, url: string }[]>([])
  const [dropdownAberto, setDropdownAberto] = useState(false)

  const sugestoesTexto = [
    '👉 CLIQUE AQUI 👈',
    'VER NA SHOPEE',
    'clique aqui',
    'remix',
    '👉 VER NA SHOPEE',
    'DISPENSER AUTOMATICO'
  ]

  const [posts] = useState([
    { id: 18150575449373607, titulo: 'PROMOÇÕES IMPERDÍVEIS', likes: 4, comentarios: 0, img: 'https://via.placeholder.com/300x400/FF6B35/ffffff?text=Promo+1', url: 'https://instagram.com/p/1' },
    { id: 18150575449373608, titulo: 'OFERTAS E PROMOÇÕES TODOS OS DIAS', likes: 3, comentarios: 0, img: 'https://via.placeholder.com/300x400/00BCD4/ffffff?text=Promo+2', url: 'https://instagram.com/p/2' },
    { id: 18150575449373609, titulo: 'DIA DO CONSUMIDOR', likes: 1, comentarios: 0, img: 'https://via.placeholder.com/300x400/833AB4/ffffff?text=Promo+3', url: 'https://instagram.com/p/3' },
    { id: 18150575449373610, titulo: 'ORGANIZADOR DE OVOS', likes: 1, comentarios: 0, img: 'https://via.placeholder.com/300x400/4CAF50/ffffff?text=Promo+4', url: 'https://instagram.com/p/4' },
    { id: 18150575449373611, titulo: 'MINI JOGO DE PANELAS 17 PEÇAS', likes: 4, comentarios: 0, img: 'https://via.placeholder.com/300x400/795548/ffffff?text=Promo+5', url: 'https://instagram.com/p/5' },
    { id: 18150575449373612, titulo: 'POTES HERMÉTICOS', likes: 3, comentarios: 0, img: 'https://via.placeholder.com/300x400/607D8B/ffffff?text=Promo+6', url: 'https://instagram.com/p/6' },
    { id: 18150575449373613, titulo: 'MINI LIQUIDIFICADOR PORTÁTIL', likes: 5, comentarios: 0, img: 'https://via.placeholder.com/300x400/00BCD4/ffffff?text=Promo+7', url: 'https://instagram.com/p/7' },
    { id: 18150575449373614, titulo: 'BORRIFADOR AZEITE', likes: 2, comentarios: 0, img: 'https://via.placeholder.com/300x400/FFC107/ffffff?text=Promo+8', url: 'https://instagram.com/p/8' },
    { id: 18150575449373615, titulo: 'FATIADOR DE LEGUMES 16 EM 1', likes: 6, comentarios: 0, img: 'https://via.placeholder.com/300x400/00BCD4/ffffff?text=Promo+9', url: 'https://instagram.com/p/9' },
    { id: 18150575449373616, titulo: 'PROJETOR 4K HD', likes: 8, comentarios: 0, img: 'https://via.placeholder.com/300x400/212121/ffffff?text=Promo+10', url: 'https://instagram.com/p/10' },
    { id: 18150575449373617, titulo: 'Fechadura Eletrônica Digital 5 em 1', likes: 3, comentarios: 0, img: 'https://via.placeholder.com/300x400/F44336/ffffff?text=Promo+11', url: 'https://instagram.com/p/11' },
    { id: 18150575449373618, titulo: 'Tablet Pc Mi10', likes: 7, comentarios: 0, img: 'https://via.placeholder.com/300x400/9C27B0/ffffff?text=Promo+12', url: 'https://instagram.com/p/12' },
  ])

  const abrirModal = (post: any) => {
    setPostSelecionado(post)
    setModalAberto(true)
    // Reset form
    setPalavraChave('')
    setFraseResposta('')
    setTextoDirect('Olá! Aqui está o link que vc me pediu lá nos comentários:')
    setTextoDestaque('👉 CLIQUE AQUI 👈')
    setLinkAfiliado('')
    setLinks([])
  }

  const adicionarLink = () => {
    if (links.length < 5) {
      setLinks([...links, { nome: '', url: '' }])
    }
  }

  const atualizarLink = (index: number, campo: 'nome' | 'url', valor: string) => {
    const novosLinks = [...links]
    novosLinks[index][campo] = valor
    setLinks(novosLinks)
  }

  const removerLink = (index: number) => {
    setLinks(links.filter((_, i) => i!== index))
  }

  return (
    <>
      {/* Sub-tabs Reels / Remix */}
      <div className="w-full flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveSubTab('reels')}
          className={`flex-1 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeSubTab === 'reels'
             ? 'border-[#1976D2] text-[#1976D2]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Instagram size={16} className="mr-1.5 inline" />
          Reels
        </button>
        <button
          onClick={() => setActiveSubTab('remix')}
          className={`flex-1 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeSubTab === 'remix'
             ? 'border-[#1976D2] text-[#1976D2]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Video size={16} className="mr-1.5 inline" />
          Remix
        </button>
      </div>

      {/* Grid de Posts */}
      <div className="w-full mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts.map((post) => (
          <div key={post.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <img 
              src={post.img} 
              alt={post.titulo}
              className="h-64 w-full object-cover"
            />
            
            <div className="p-2.5">
              <div className="mb-2 flex items-center gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Heart size={14} className="fill-gray-400 text-gray-400" />
                  {post.likes} likes
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={14} />
                  {post.comentarios} comentários
                </span>
              </div>

              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2 flex w-full items-center justify-center gap-1.5 rounded bg-[#E53935] py-1.5 text-xs font-bold text-white hover:bg-[#D32F2F]"
              >
                <Instagram size={14} />
                Ver no Instagram
              </a>

              <button
                onClick={() => abrirModal(post)}
                className="flex w-full items-center justify-center gap-1.5 rounded bg-[#4CAF50] py-1.5 text-xs font-bold text-white hover:bg-[#45A049]"
              >
                <Plus size={14} />
                Nova Automação
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nova Automação */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h- w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Nova Automação</h3>
                <p className="text-xs text-gray-500">
                  Configurando nova automação para o Reel/Post ID: {postSelecionado?.id}
                </p>
              </div>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              <button className="mb-4 flex w-full items-center justify-center gap-2 rounded bg-[#546E7A] py-2.5 text-sm font-semibold text-white hover:bg-[#455A64]">
                <Wand2 size={16} />
                Preencher Automaticamente
              </button>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                    PALAVRA CHAVE GATILHO (EX: EU QUERO)
                  </label>
                  <input
                    type="text"
                    value={palavraChave}
                    onChange={(e) => setPalavraChave(e.target.value)}
                    placeholder="quero"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                    FRASE DE RESPOSTA AO COMENTÁRIO
                  </label>
                  <input
                    type="text"
                    value={fraseResposta}
                    onChange={(e) => setFraseResposta(e.target.value)}
                    placeholder="auto"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Escreva: auto, para o sistema enviar frases automática para você; ou Envie várias frases separadas por ; (ponto e virgula) Ex: Minha respota 1; Minha resposta 2
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                    TEXTO ENVIADO NO DIRECT: (OK! AQUI ESTÁ SEU LINK:)
                  </label>
                  <textarea
                    value={textoDirect}
                    onChange={(e) => setTextoDirect(e.target.value)}
                    maxLength={500}
                    rows={3}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">Limite de 500 caracteres.</p>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                    TEXTO DE DESTAQUE: (EX: VER NA SHOPEE)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={textoDestaque}
                      onChange={(e) => setTextoDestaque(e.target.value)}
                      onFocus={() => setDropdownAberto(true)}
                      onBlur={() => setTimeout(() => setDropdownAberto(false), 200)}
                      className="w-full rounded border border-[#6366F1] px-3 py-2 text-sm focus:border-[#6366F1] focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                    />
                    {dropdownAberto && (
                      <div className="absolute z-10 mt-1 w-full rounded border border-gray-200 bg-white shadow-lg">
                        {sugestoesTexto.map((sugestao, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setTextoDestaque(sugestao)
                              setDropdownAberto(false)
                            }}
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            {sugestao}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                    LINK DE AFILIADO (EX: HTTPS://SHOPEE.COM)
                  </label>
                  <input
                    type="url"
                    value={linkAfiliado}
                    onChange={(e) => setLinkAfiliado(e.target.value)}
                    placeholder="https://youtu.be/5u4ac8mxlhc"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter a valid URL: https://www.google.com</p>
                </div>

                {/* Links adicionais */}
                {links.map((link, index) => (
                  <div key={index} className="rounded border border-gray-200 bg-gray-50 p-3">
                    <div className="mb-2">
                      <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                        NOME DO PRODUTO
                      </label>
                      <input
                        type="text"
                        value={link.nome}
                        onChange={(e) => atualizarLink(index, 'nome', e.target.value)}
                        placeholder="PRODUTO"
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                        LINK DO PRODUTO
                      </label>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => atualizarLink(index, 'url', e.target.value)}
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => removerLink(index)}
                      className="flex w-full items-center justify-center gap-1.5 rounded bg-[#E53935] py-2 text-xs font-bold text-white hover:bg-[#D32F2F]"
                    >
                      <Trash2 size={14} />
                      Deletar link
                    </button>
                  </div>
                ))}

                <button
                  onClick={adicionarLink}
                  className="flex w-full items-center justify-center gap-1.5 rounded bg-[#4CAF50] py-2.5 text-sm font-bold text-white hover:bg-[#45A049]"
                >
                  <Plus size={16} />
                  Adicionar link
                </button>

                <button
                  onClick={() => setModalAberto(false)}
                  className="flex w-full items-center justify-center gap-1.5 rounded bg-[#6366F1] py-2.5 text-sm font-bold text-white hover:bg-[#4F46E5]"
                >
                  <Save size={16} />
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-6 text-center text-xs text-gray-400">
        © 2026
      </div>
    </>
  )
}

function AliExpressTab() {
  const [planoIniciantes] = useState(true)
  const [afiliadoConfigurado] = useState(false)
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null)
  const [categoria, setCategoria] = useState('')
  const [produtosExibir, setProdutosExibir] = useState('12')
  const [ordenarPor, setOrdenarPor] = useState('Data Atualização - Mais Novos')
  const [acaoMassa, setAcaoMassa] = useState('')
  const [todosMarcados, setTodosMarcados] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivoSelecionado(e.target.files[0])
    }
  }

  return (
    <>
      {/* Banner ATENÇÃO Afiliado */}
      {!afiliadoConfigurado && (
        <div className="w-full mt-4 rounded border border-[#F48FB1] bg-[#FCE4EC] px-4 py-3">
          <p className="text-sm font-bold text-[#C2185B]">ATENÇÃO!</p>
          <p className="text-xs text-[#AD1457]">
            Você deve configurar suas informações de afiliado AliExpress para usar o recurso de categorias/palavra-chave!{' '}
            <button className="font-bold underline">CLIQUE AQUI</button>
          </p>
        </div>
      )}

      {/* Card Importar Produtos em Massa */}
      <div className="w-full mt-4 rounded border border-gray-300 bg-white p-4">
        <h4 className="mb-1 text-sm font-semibold text-gray-900">Importar Produtos em Massa</h4>
        <p className="mb-3 text-xs text-gray-500">ARQUIVO DE PRODUTOS.XLS</p>

        <div className="mb-3 flex items-center gap-2">
          <label className="cursor-pointer rounded border border-gray-300 bg-white px-3 py-1 text-xs hover:bg-gray-70">
            Escolher arquivo
            <input 
              type="file" 
              accept=".csv,.xls,.xlsx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <span className="text-xs text-gray-500">
            {arquivoSelecionado? arquivoSelecionado.name : 'Nenhum arquivo escolhido'}
          </span>
        </div>

        <div className="mb-3 text-xs text-gray-600">
          <p>O arquivo CSV deve ter as seguintes colunas na ordem:</p>
          <p className="mt-1 text-gray-500">
            ProductId, Image Url, Video Url, Product Desc, Origin Price, Discount Price, Discount Currency, Direct linking, commission rate (%), Estimated direct linking commission, Indirect linking commission rate (%), Estimated indirect linking commission, Sales180Day, Positive Feedback, Promotion Url, Code Name, Code Start Time, Code End Time, Code Value, Code Quantity, Code Minimum Spend.
          </p>
        </div>

        <button 
          disabled={!arquivoSelecionado}
          className="rounded bg-[#2196F3] px-5 py-1.5 text-xs font-bold text-white hover:bg-[#1976D2] disabled:opacity-50"
        >
          Importar
        </button>
      </div>

      {/* Categorias / Palavras-chave */}
      <div className="w-full mt-4 border-t border-gray-200 pt-4">
        <div className="mb-2 flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700">Categorias / Palavras-chave</label>
          <button className="rounded bg-[#E53935] px-3 py-1 text-xs font-bold text-white hover:bg-[#D32F2F]">
            Exibir Tudo
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Pesquisar"
            className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button className="rounded bg-[#2196F3] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#1976D2]">
            Pesquisar
          </button>
        </div>
      </div>

      {/* Filtros Produtos */}
      <div className="w-full mt-4 border-t border-gray-200 pt-4">
        <div className="mb-2 flex items-center gap-4">
          <label className="text-xs font-semibold text-gray-700">Produtos</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Exibir:</span>
            <select
              value={produtosExibir}
              onChange={(e) => setProdutosExibir(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
            >
              <option>12</option>
              <option>24</option>
              <option>48</option>
              <option>96</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Ordenar por:</span>
            <select
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
            >
              <option>Data Atualização - Mais Novos</option>
              <option>Data Atualização - Mais Antigos</option>
              <option>Preço - Menor</option>
              <option>Preço - Maior</option>
              <option>Comissão - Maior</option>
            </select>
          </div>
        </div>

        {/* Ações em Massa */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-gray-700">
            <input
              type="checkbox"
              checked={todosMarcados}
              onChange={(e) => setTodosMarcados(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-gray-300"
            />
            Todos
          </label>
          <select
            value={acaoMassa}
            onChange={(e) => setAcaoMassa(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
          >
            <option value="">Selecione uma ação</option>
            <option value="deletar">Deletar Selecionados</option>
            <option value="exportar">Exportar Selecionados</option>
          </select>
          <button 
            disabled={!acaoMassa}
            className="rounded bg-[#2196F3] px-4 py-1 text-xs font-bold text-white hover:bg-[#1976D2] disabled:opacity-50"
          >
            Executar
          </button>
        </div>
      </div>
      <div className="mt-6 text-center text-xs text-gray-400">
        © 2026
      </div>
    </>
  )
}

function AmazonTab() {
  const [planoIniciantes] = useState(true)
  const [afiliadoConfigurado] = useState(false)
  const [categoria, setCategoria] = useState('')
  const [produtosExibir, setProdutosExibir] = useState('12')
  const [ordenarPor, setOrdenarPor] = useState('Data Atualização - Mais Novos')
  const [acaoMassa, setAcaoMassa] = useState('')
  const [todosMarcados, setTodosMarcados] = useState(false)

  return (
    <>
      {/* Banner ATENÇÃO Afiliado Amazon */}
      {!afiliadoConfigurado && (
        <div className="w-full mt-4 rounded border border-[#F48FB1] bg-[#FCE4EC] px-4 py-3">
          <p className="text-sm font-bold text-[#C2185B]">ATENÇÃO!</p>
          <p className="text-xs text-[#AD1457]">
            Você deve configurar suas informações de afiliado AMAZON para usar esse recurso!{' '}
            <button className="font-bold underline">CLIQUE AQUI</button>
          </p>
        </div>
      )}

      {/* Categorias / Palavras-chave */}
      <div className="w-full mt-4 border-t border-gray-200 pt-4">
        <div className="mb-2 flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700">Categorias / Palavras-chave</label>
          <button className="rounded bg-[#E53935] px-3 py-1 text-xs font-bold text-white hover:bg-[#D32F2F]">
            Excluir Tudo
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Pesquisar"
            className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button className="rounded bg-[#2196F3] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#1976D2]">
            Pesquisar
          </button>
        </div>
      </div>

      {/* Filtros Produtos */}
      <div className="w-full mt-4 border-t border-gray-200 pt-4">
        <div className="mb-2 flex items-center gap-4">
          <label className="text-xs font-semibold text-gray-700">Produtos</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Exibir:</span>
            <select
              value={produtosExibir}
              onChange={(e) => setProdutosExibir(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
            >
              <option>12</option>
              <option>24</option>
              <option>48</option>
              <option>96</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Ordenar por:</span>
            <select
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
            >
              <option>Data Atualização - Mais Novos</option>
              <option>Data Atualização - Mais Antigos</option>
              <option>Preço - Menor</option>
              <option>Preço - Maior</option>
              <option>Comissão - Maior</option>
            </select>
          </div>
        </div>

        {/* Ações em Massa */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-gray-700">
            <input
              type="checkbox"
              checked={todosMarcados}
              onChange={(e) => setTodosMarcados(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-gray-300"
            />
            Todos
          </label>
          <select
            value={acaoMassa}
            onChange={(e) => setAcaoMassa(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
          >
            <option value="">Selecione uma ação</option>
            <option value="deletar">Deletar Selecionados</option>
            <option value="exportar">Exportar Selecionados</option>
          </select>
          <button 
            disabled={!acaoMassa}
            className="rounded bg-[#2196F3] px-4 py-1 text-xs font-bold text-white hover:bg-[#1976D2] disabled:opacity-50"
          >
            Executar
          </button>
        </div>
      </div>
      <div className="mt-6 text-center text-xs text-gray-400">
        © 2026
      </div>
    </>
  )
}

function MercadoLivreTab() {
  const [planoIniciantes] = useState(true)
  const [bannerExtensao, setBannerExtensao] = useState(true)
  
  // Adicionar Produto por Link
  const [link, setLink] = useState('')
  const [colecaoDestino, setColecaoDestino] = useState('')
  const [idGrupo, setIdGrupo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [agendamento, setAgendamento] = useState('')
  
  // Cupons
  const [tipoCupom, setTipoCupom] = useState('')
  const [valorDesconto, setValorDesconto] = useState('')
  const [valorMinimo, setValorMinimo] = useState('')
  const [valorMaximo, setValorMaximo] = useState('')
  const [codigoCupom, setCodigoCupom] = useState('')
  const [inserirLinkPost, setInserirLinkPost] = useState(false)
  
  // Buscar por Categoria
  const [categoriaPrincipal, setCategoriaPrincipal] = useState('')
  const [subcategoria, setSubcategoria] = useState('')
  const [buscarMaisVendidos, setBuscarMaisVendidos] = useState(false)
  
  // Texto Padrão
  const [descricaoMercadoLivre, setDescricaoMercadoLivre] = useState('')
  const [respostaMercadoLivre, setRespostaMercadoLivre] = useState('')
  
  // Filtros
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [produtosExibir, setProdutosExibir] = useState('12')
  const [ordenarPor, setOrdenarPor] = useState('Data Atualização - Mais Novos')
  const [acaoMassa, setAcaoMassa] = useState('')
  const [todosMarcados, setTodosMarcados] = useState(false)

  return (
    <>
      {/* Grid 3 Colunas */}
      <div className="w-full mt-4 grid gap-4 lg:grid-cols-3">
        
        {/* COLUNA 1: Adicionar Produto por Link + Cupons */}
        <div className="w-full space-y-4">
          <div className="rounded border border-gray-300 bg-white p-4">
            <h4 className="mb-3 text-sm font-semibold text-gray-900">
              Adicionar Produto por Link
            </h4>
            <p className="mb-3 text-xs text-gray-600">
              Cole qualquer link do produto ML normal, link de afiliado ou link da ML. O sistema irá extrair o produto e gerar o link de afiliado automaticamente.
            </p>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">LINK</label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">COLEÇÃO DE DESTINO</label>
                <select
                  value={colecaoDestino}
                  onChange={(e) => setColecaoDestino(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Selecione um coleção ou digite um novo</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">ID DO GRUPO (NA URL DO CANAL/GRUPO)</label>
                <input
                  type="text"
                  value={idGrupo}
                  onChange={(e) => setIdGrupo(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">DESCRIÇÃO</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                  className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">Essa descrição se aplica somente a esse produto adicionado.</p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">AGENDAMENTO</label>
                <div className="relative">
                  <input
                    type="text"
                    value={agendamento}
                    onChange={(e) => setAgendamento(e.target.value)}
                    placeholder="dd/mm/aaaa --:--"
                    className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <Calendar size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <p className="mt-1 text-xs text-gray-500">Selecione a Data e Hora</p>
              </div>
            </div>
          </div>

          {/* Card Cupons */}
          <div className="w-full rounded border border-[#4FC3F7] bg-white">
            <div className="bg-[#4FC3F7] px-4 py-2">
              <h4 className="text-sm font-semibold text-white">Cupons</h4>
            </div>
            <div className="space-y-3 p-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">TIPO DE CUPOM</label>
                <select
                  value={tipoCupom}
                  onChange={(e) => setTipoCupom(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Selecione o tipo de cupom </option>
                  <option value="percentual">Percentual</option>
                  <option value="valor">Valor Fixo</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">VALOR DO DESCONTO</label>
                <input
                  type="text"
                  value={valorDesconto}
                  onChange={(e) => setValorDesconto(e.target.value)}
                  placeholder="Ex: 10 ou 50"
                  className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">Digite apenas números inteiros.</p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">VALOR MÍNIMO DA COMPRA PARA APLICAR O CUPOM</label>
                <input
                  type="text"
                  value={valorMinimo}
                  onChange={(e) => setValorMinimo(e.target.value)}
                  placeholder="Ex: 50 ou 100"
                  className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">Digite apenas números inteiros.</p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">VALOR MÁXIMO DO CUPOM</label>
                <input
                  type="text"
                  value={valorMaximo}
                  onChange={(e) => setValorMaximo(e.target.value)}
                  placeholder="Ex: 100 ou 200"
                  className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">Digite apenas números inteiros.</p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">CÓDIGO DO CUPOM</label>
                <input
                  type="text"
                  value={codigoCupom}
                  onChange={(e) => setCodigoCupom(e.target.value)}
                  placeholder="Ex: CUPOM10"
                  className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button className="w-full rounded bg-[#2196F3] py-2 text-sm font-bold text-white hover:bg-[#1976D2]">
                Salvar
              </button>

              <label className="grid grid-cols-[16px_1fr] gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox" 
                  checked={inserirLinkPost}
                  onChange={(e) => setInserirLinkPost(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-gray-300"
                />
                Inserir esse link no post
              </label>

              <div className="text-xs text-gray-600">
                <p className="font-semibold">Exemplos válidos:</p>
                <p className="break-all text-[#2196F3]">https://www.mercadolivre.com.br/oferta/D_NQ_NP_893711-MLB770...87-478</p>
                <p className="break-all text-[#2196F3]">https://mercadolivre.com.br/social/vendas/ofertas?seller_id=2247363</p>
                <p className="break-all text-[#2196F3]">https://mercadolivre.com.br/social/vendas/ofertas?seller_id=2247363</p>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA 2: Buscar por Categoria */}
        <div className="w-full rounded border border-gray-300 bg-white p-4">
          <h4 className="mb-3 text-sm font-semibold text-gray-900">
            Buscar por Categoria Ofertas do Dia
          </h4>
          <p className="mb-3 text-xs text-gray-600">
            Selecione uma categoria e subcategoria opcional para buscar produtos.
          </p>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">CATEGORIA PRINCIPAL</label>
              <select
                value={categoriaPrincipal}
                onChange={(e) => setCategoriaPrincipal(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Selecione uma categoria</option>
                <option value="eletronicos">Eletrônicos</option>
                <option value="casa">Casa e Móveis</option>
                <option value="moda">Moda</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">SUBCATEGORIA (OPCIONAL)</label>
              <select
                value={subcategoria}
                onChange={(e) => setSubcategoria(e.target.value)}
                disabled={!categoriaPrincipal}
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
              >
                <option value="">Primeiro selecione uma categoria principal</option>
              </select>
            </div>

            <label className="grid grid-cols-[16px_1fr] gap-2 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={buscarMaisVendidos}
                onChange={(e) => setBuscarMaisVendidos(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-gray-300"
              />
              Buscar Mais Vendidos
            </label>

            <button className="w-full rounded bg-[#2196F3] py-2 text-sm font-bold text-white hover:bg-[#1976D2]">
              Buscar Produtos
            </button>

            <div className="rounded bg-[#FFF9C4] p-3 text-xs text-[#F57F17]">
              <p className="mb-2 font-bold">⚠ Categorias com Busca Automática desativada por excesso de produtos banidos automaticamente. Para adicionar produtos destas categorias, use o método de adicionar por link</p>
              <p className="font-semibold">Acesse os alertas diretamente:</p>
              <p>• Carros, Motos e Outros</p>
              <p>• Imóveis</p>
              <p>• Ingressos</p>
              <p className="mt-1">+ Mais Categorias</p>
            </div>
          </div>
        </div>

        {/* COLUNA 3: Texto Padrão */}
        <div className="w-full rounded border border-gray-300 bg-white p-4">
          <h4 className="mb-3 text-sm font-semibold text-gray-900">Texto Padrão</h4>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                CONFIGURAÇÃO DO MERCADO LIVRE
              </label>
              <textarea
                value={descricaoMercadoLivre}
                onChange={(e) => setDescricaoMercadoLivre(e.target.value)}
                rows={8}
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Este texto será exibido como descrição em um produto do Mercado Livre. Salve abaixo o código geral.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                RESPOSTA DO MERCADO LIVRE
              </label>
              <textarea
                value={respostaMercadoLivre}
                onChange={(e) => setRespostaMercadoLivre(e.target.value)}
                rows={8}
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Este texto será exibido na DM do post de um produto do Mercado Livre. Salve abaixo o código geral.
              </p>
            </div>

            <button className="w-full rounded bg-[#2196F3] py-2 text-sm font-bold text-white hover:bg-[#1976D2]">
              Salvar
            </button>
          </div>
        </div>
      </div>

      {/* Categorias / Palavras-chave */}
      <div className="w-full mt-4 border-t border-gray-200 pt-4">
        <div className="mb-2 flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700">Categorias / Palavras-chave</label>
          <button className="rounded bg-[#E53935] px-3 py-1 text-xs font-bold text-white hover:bg-[#D32F2F]">
            Excluir Tudo
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            placeholder="Pesquisar"
            className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button className="rounded bg-[#2196F3] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#1976D2]">
            Pesquisar
          </button>
        </div>
      </div>

      {/* Filtros Produtos */}
      <div className="w-full mt-4 border-t border-gray-200 pt-4">
        <div className="mb-2 flex items-center gap-4">
          <label className="text-xs font-semibold text-gray-700">Produtos</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Exibir:</span>
            <select
              value={produtosExibir}
              onChange={(e) => setProdutosExibir(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
            >
              <option>12</option>
              <option>24</option>
              <option>48</option>
              <option>96</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Ordenar por:</span>
            <select
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
            >
              <option>Data Atualização - Mais Novos</option>
              <option>Data Atualização - Mais Antigos</option>
              <option>Preço - Menor</option>
              <option>Preço - Maior</option>
              <option>Comissão - Maior</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-gray-700">
            <input
              type="checkbox"
              checked={todosMarcados}
              onChange={(e) => setTodosMarcados(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-gray-300"
            />
            Todos
          </label>
          <select
            value={acaoMassa}
            onChange={(e) => setAcaoMassa(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
          >
            <option value="">Selecione uma ação</option>
            <option value="deletar">Deletar Selecionados</option>
            <option value="exportar">Exportar Selecionados</option>
          </select>
          <button 
            disabled={!acaoMassa}
            className="rounded bg-[#2196F3] px-4 py-1 text-xs font-bold text-white hover:bg-[#1976D2] disabled:opacity-50"
          >
            Executar
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-400">
        © 2026
      </div>
    </>
  )
}

function SheinTab() {
  const [planoIniciantes] = useState(true)
  const [linkAfiliado, setLinkAfiliado] = useState('')
  const [cabecalho, setCabecalho] = useState('')
  const [rodape, setRodape] = useState('')
  const [pesquisar, setPesquisar] = useState('')
  const [produtosExibir, setProdutosExibir] = useState('12')
  const [ordenarPor, setOrdenarPor] = useState('Data Atualização - Mais Novos')
  const [acaoMassa, setAcaoMassa] = useState('')
  const [todosMarcados, setTodosMarcados] = useState(false)

  return (
    <>
      {/* Grid 3 Colunas */}
      <div className="w-full mt-4 grid gap-4 lg:grid-cols-3">
        
        {/* COLUNA 1: Adicionar Produto por Link de Afiliado */}
        <div className="w-full rounded border border-gray-300 bg-white p-4">
          <div className="mb-3 flex items-center gap-1.5">
            <LinkIcon size={16} className="text-gray-600" />
            <h4 className="text-sm font-semibold text-gray-900">
              Adicionar Produto por Link de Afiliado
            </h4>
          </div>

          <div className="mb-4 rounded bg-[#FFF9C4] px-3 py-2">
            <p className="mb-1 text-xs font-bold text-[#F57F17]">
              ⚠ IMPORTANTE:
            </p>
            <p className="text-xs text-[#F57F17]">
              O link que você colar aqui será usado <span className="font-semibold">diretamente no post</span>. O sistema <span className="font-semibold">NÃO converte</span> links da Shein — use seu link de afiliado já gerado no Aplicativo da Shein.
            </p>
          </div>

          <div className="mb-3">
            <div className="mb-2 flex items-center gap-1.5">
              <LinkIcon size={14} className="text-gray-600" />
              <label className="text-xs font-semibold uppercase text-gray-600">
                LINK DE AFILIADO SHEIN
              </label>
            </div>
            <textarea
              value={linkAfiliado}
              onChange={(e) => setLinkAfiliado(e.target.value)}
              placeholder="Cole seu link de afiliado gerado no App da Shein aqui"
              rows={3}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button className="w-full rounded bg-[#2196F3] py-2 text-sm font-bold text-white hover:bg-[#1976D2]">
            Salvar
          </button>

          <div className="mt-4 text-xs text-gray-600">
            <div className="mb-2 flex items-center gap-1.5">
              <Info size={14} className="text-[#2196F3]" />
              <p className="font-semibold">Formato aceito:</p>
            </div>
            <p className="text-[#2196F3]">• Link de afiliado gerado no App da Shein</p>
            <p className="break-all text-[#2196F3]">https://onelink.shein.com/2b/xJ4jByuwlm</p>
          </div>
        </div>

        {/* COLUNA 2: Texto Padrão */}
        <div className="w-full rounded border border-gray-300 bg-white p-4">
          <div className="mb-3 flex items-center gap-1.5">
            <Info size={16} className="text-gray-600" />
            <h4 className="text-sm font-semibold text-gray-900">
              Texto Padrão
            </h4>
          </div>
          <p className="mb-3 text-xs text-gray-600">
            Defina o texto padrão para produtos da Shein.
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                CABEÇALHO DA SHEIN
              </label>
              <textarea
                value={cabecalho}
                onChange={(e) => setCabecalho(e.target.value)}
                rows={6}
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Esse texto será exibido acima do título de um produto da Shein. Substitui o cabeçalho geral.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                RODAPÉ DA SHEIN
              </label>
              <textarea
                value={rodape}
                onChange={(e) => setRodape(e.target.value)}
                rows={6}
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Esse texto será exibido no final do post de um produto da Shein. Substitui o rodapé geral.
              </p>
            </div>

            <button className="w-full rounded bg-[#2196F3] py-2 text-sm font-bold text-white hover:bg-[#1976D2]">
              Salvar
            </button>
          </div>
        </div>

        {/* COLUNA 3: Sobre a Integração Shein */}
        <div className="w-full rounded border border-gray-300 bg-white p-4">
          <div className="mb-3 flex items-center gap-1.5">
            <Info size={16} className="text-gray-600" />
            <h4 className="text-sm font-semibold text-gray-900">
              Sobre a Integração Shein
            </h4>
          </div>

          <p className="mb-3 text-xs text-gray-700">Para usar esta integração:</p>
          
          <div className="mb-4 space-y-1.5 text-xs text-gray-700">
            <p>Cadastre-se no programa de afiliados da Shein</p>
            <p>Gere o link de afiliado no <span className="font-semibold">Aplicativo da Shein</span></p>
            <p>Cole o link aqui para extrair os dados automaticamente</p>
          </div>

          <div className="mb-3 rounded bg-[#FFF9C4] px-3 py-2">
            <p className="text-xs text-[#F57F17]">
              <span className="font-bold">🔗 Link no Post:</span> O link que você colar será usado diretamente no post. Não há conversão de links para a Shein.
            </p>
          </div>

          <div className="rounded bg-[#E1F5FE] px-3 py-2">
            <p className="text-xs text-[#0288D1]">
              <span className="font-bold">💡 Dica:</span> O sistema extrai automaticamente os dados do produto (título, preço, imagem) a partir do link.
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="w-full mt-4 border-t border-gray-200 pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={pesquisar}
            onChange={(e) => setPesquisar(e.target.value)}
            placeholder="Pesquisar"
            className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button className="rounded bg-[#2196F3] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#1976D2]">
            Pesquisar
          </button>
        </div>
      </div>

      {/* Filtros Produtos */}
      <div className="w-full mt-4 border-t border-gray-200 pt-4">
        <div className="mb-2 flex items-center gap-4">
          <label className="text-xs font-semibold text-gray-700">Produtos</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Exibir:</span>
            <select
              value={produtosExibir}
              onChange={(e) => setProdutosExibir(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
            >
              <option>12</option>
              <option>24</option>
              <option>48</option>
              <option>96</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Ordenar por:</span>
            <select
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
            >
              <option>Data Atualização - Mais Novos</option>
              <option>Data Atualização - Mais Antigos</option>
              <option>Preço - Menor</option>
              <option>Preço - Maior</option>
              <option>Comissão - Maior</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-gray-700">
            <input
              type="checkbox"
              checked={todosMarcados}
              onChange={(e) => setTodosMarcados(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-gray-300"
            />
            Todos
          </label>
          <select
            value={acaoMassa}
            onChange={(e) => setAcaoMassa(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
          >
            <option value="">Selecione uma ação</option>
            <option value="deletar">Deletar Selecionados</option>
            <option value="exportar">Exportar Selecionados</option>
          </select>
          <button 
            disabled={!acaoMassa}
            className="rounded bg-[#2196F3] px-4 py-1 text-xs font-bold text-white hover:bg-[#1976D2] disabled:opacity-50"
          >
            Executar
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-400">
        © 2026
      </div>
    </>
  )
}

function ColaboradoresTab() {
  const [planoIniciantes] = useState(true)
  const [emailColaborador, setEmailColaborador] = useState('')
  const [expiracao, setExpiracao] = useState('')
  
  
  const enviarConvite = () => {
    if (!emailColaborador) {
      alert('Preencha o e-mail do colaborador')
      return
    }
    console.log('Enviando convite para:', emailColaborador, 'Expira em:', expiracao)
    // Aqui chama API de convite
  }

  return (
    <>
    {/* Formulário Convidar Colaborador */}
      <div className="w-full mt-4 rounded-lg border border-gray-200 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-gray-900">Convidar Colaborador</h4>
        
        <div className="mb-4 rounded border border-[#4FC3F7] bg-[#E1F5FE] px-4 py-3">
          <p className="text-xs text-[#0288D1]">
            Antes de convidar o usuário ele deve fazer login e criar uma conta no sistema.
          </p>
        </div>

        <div className="w-full space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
              E-MAIL DO COLABORADOR
            </label>
            <input
              type="email"
              value={emailColaborador}
              onChange={(e) => setEmailColaborador(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              O colaborador deve ser cadastrado no sistema
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
              EXPIRAÇÃO
            </label>
            <div className="relative">
              <input
                type="text"
                value={expiracao}
                onChange={(e) => setExpiracao(e.target.value)}
                placeholder="dd/mm/aaaa"
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
              <Calendar size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <button 
            onClick={enviarConvite}
            className="rounded bg-[#2196F3] px-6 py-2 text-sm font-bold text-white hover:bg-[#1976D2]"
          >
            Enviar convite
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-400">
        © 2026
      </div>
    </>
  )
}