import { useEffect, useMemo, useState } from 'react'

const initialUsers = [
  { email: 'admin@satd.com', password: 'satd123', name: 'Administrador SATD' },
  { email: 'usuario@cali.com', password: '123456', name: 'Usuario Cali' }
]

const safeZones = [
  {
    name: 'Coliseo del Pueblo',
    distance: '1.2 km',
    status: 'Abierto',
    lat: 3.4372,
    lng: -76.5205,
    route: [
      'Sal del punto actual por la avenida principal.',
      'Avanza 450 m hacia el norte siguiendo la ruta segura.',
      'Gira a la derecha en el semáforo y continúa 300 m.',
      'Cruza por el puente peatonal y entra al Coliseo del Pueblo.',
    ],
  },
  {
    name: 'Unidad Deportiva',
    distance: '1.8 km',
    status: 'Abierto',
    lat: 3.4501,
    lng: -76.5180,
    route: [
      'Toma la vía de evacuación más cercana.',
      'Sigue recto durante 600 m por la ruta señalizada.',
      'Gira a la izquierda al llegar al paradero de bus.',
      'Llega a la entrada principal de la Unidad Deportiva.',
    ],
  },
  {
    name: 'Parque Las Banderas',
    distance: '2.1 km',
    status: 'Capacidad media',
    lat: 3.4278,
    lng: -76.5089,
    route: [
      'Sal por la calle lateral y sigue los avisos de emergencia.',
      'Continúa 700 m hasta el cruce seguro.',
      'Gira a la derecha y avanza 350 m.',
      'Entra al Parque Las Banderas por la zona verde.',
    ],
  },
  {
    name: 'Colegio Santa Librada',
    distance: '2.5 km',
    status: 'Abierto',
    lat: 3.4156,
    lng: -76.5312,
    route: [
      'Ve hacia la vía principal y mantente en la acera derecha.',
      'Avanza 500 m sin detenerte.',
      'Gira a la izquierda en la esquina del almacén.',
      'Sigue hasta el colegio, punto seguro de evacuación.',
    ],
  },
]

const initialReports = [
  { title: 'Inundación leve', place: 'Puente Juanchito', state: 'Urgente' },
  { title: 'Árbol caído', place: 'Orilla del río', state: 'En revisión' },
  { title: 'Tramo con basura', place: 'Sector sur', state: 'Atendido' }
]

function getAlertByLevel(level) {
  if (level >= 3.5) return { title: 'Alerta Roja', tone: 'red', message: 'Evacuación inmediata y activación de protocolos.' }
  if (level >= 2.8) return { title: 'Alerta Naranja', tone: 'orange', message: 'Listos para evacuar y vigilar zonas críticas.' }
  return { title: 'Alerta Amarilla', tone: 'yellow', message: 'Preparación preventiva y seguimiento constante.' }
}

function randomLevel(prev) {
  const next = +(prev + (Math.random() * 0.26 - 0.12)).toFixed(2)
  return Math.min(4.4, Math.max(1.2, next))
}

export default function SATDApp() {
  const [screen, setScreen] = useState('home')
  const [mode, setMode] = useState('guest')
  const [isLogged, setIsLogged] = useState(false)
  const [level, setLevel] = useState(3.18)
  const [selectedZone, setSelectedZone] = useState(0)
  const [reports, setReports] = useState(initialReports)
  const [users, setUsers] = useState(initialUsers)
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' })
  const [loginForm, setLoginForm] = useState({ email: 'admin@satd.com', password: 'satd123' })
  const [message, setMessage] = useState('Simulación lista. El sistema está activo.')
  const [recentAlerts, setRecentAlerts] = useState([
    { type: 'Roja', text: 'Nivel alto detectado en el río', time: 'Hace 2 min' },
    { type: 'Naranja', text: 'Incremento rápido del caudal', time: 'Hace 11 min' },
    { type: 'Amarilla', text: 'Seguimiento preventivo', time: 'Hace 35 min' }
  ])
  const [gpsOpen, setGpsOpen] = useState(false)
  const [gpsStep, setGpsStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLevel(prev => {
        const next = randomLevel(prev)
        const alert = getAlertByLevel(next)
        setMessage(`Nivel actualizado: ${next.toFixed(2)} m · ${alert.title}`)
        setRecentAlerts(prevAlerts => [
          {
            type: alert.tone === 'red' ? 'Roja' : alert.tone === 'orange' ? 'Naranja' : 'Amarilla',
            text: `Nivel del río en ${next.toFixed(2)} m`,
            time: 'Ahora'
          },
          ...prevAlerts.slice(0, 2)
        ])
        return next
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!gpsOpen) return
    const activeRoute = safeZones[selectedZone].route
    if (!activeRoute.length) return

    setGpsStep(0)
    const interval = setInterval(() => {
      setGpsStep(prev => (prev + 1) % activeRoute.length)
    }, 2200)

    return () => clearInterval(interval)
  }, [gpsOpen, selectedZone])

  const currentAlert = useMemo(() => getAlertByLevel(level), [level])
  const onlineUsers = isLogged ? users.length + 18 : users.length + 9

  function handleLogin() {
    const found = users.find(
      u => u.email.toLowerCase() === loginForm.email.toLowerCase() && u.password === loginForm.password
    )

    if (found) {
      setMode('user')
      setIsLogged(true)
      setScreen('dashboard')
      setMessage(`Bienvenido, ${found.name}. Sesión iniciada correctamente.`)
      return
    }

    setMessage('Correo o contraseña incorrectos. Verifica los datos e inténtalo otra vez.')
  }

  function handleRegister() {
    if (!authForm.name || !authForm.email || !authForm.password) {
      setMessage('Completa todos los campos para crear el usuario.')
      return
    }

    const exists = users.some(u => u.email.toLowerCase() === authForm.email.toLowerCase())
    if (exists) {
      setMessage('Ese correo ya existe. Usa otro distinto.')
      return
    }

    const newUser = { name: authForm.name, email: authForm.email, password: authForm.password }
    setUsers(prev => [newUser, ...prev])
    setMode('user')
    setIsLogged(true)
    setScreen('dashboard')
    setMessage(`Usuario creado con éxito: ${authForm.name}`)
    setLoginForm({ email: authForm.email, password: authForm.password })
    setAuthForm({ name: '', email: '', password: '' })
  }

  function addReport() {
    const options = [
      { title: 'Nivel elevado', place: 'Sector ribereño', state: 'Urgente' },
      { title: 'Vía obstruida', place: 'Cercanías del río', state: 'En proceso' },
      { title: 'Punto inseguro', place: 'Barrio cercano', state: 'Reportado' }
    ]
    const item = options[Math.floor(Math.random() * options.length)]
    setReports(prev => [item, ...prev.slice(0, 4)])
    setMessage(`Reporte agregado: ${item.title} en ${item.place}`)
    setScreen('community')
  }

  function activateAlert(type) {
    setRecentAlerts(prev => [
      {
        type,
        text: `Nueva alerta ${type} activada`,
        time: 'Ahora'
      },
      ...prev.slice(0, 2)
    ])

    setScreen('alerts')
  }

  function openGps(zoneIndex) {
    setSelectedZone(zoneIndex)
    setGpsOpen(true)
    setScreen('zones')
    setMessage(`GPS iniciado hacia ${safeZones[zoneIndex].name}`)
  }

  function closeGps() {
    setGpsOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_34%),linear-gradient(180deg,_#020817_0%,_#07162f_45%,_#020817_100%)]">
        <div className="mx-auto flex min-h-screen max-w-[1600px] items-center justify-center px-3 py-3 md:px-6">
          <div className="w-full overflow-hidden rounded-[40px] border border-cyan-900/60 bg-[#07111f]/70 shadow-[0_30px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <HeaderBar
              mode={mode}
              level={level}
              alert={currentAlert}
              isLogged={isLogged}
              onlineUsers={onlineUsers}
              onNavigate={setScreen}
            />

            <div className="grid min-h-[calc(100vh-96px)] grid-cols-1 lg:grid-cols-[280px_1fr]">
              <Sidebar
                screen={screen}
                setScreen={setScreen}
                isLogged={isLogged}
                level={level}
                alert={currentAlert}
                onQuickAlert={activateAlert}
                onAddReport={addReport}
              />

              <main className="bg-[#06101e]/85 p-4 md:p-6">
                {screen === 'home' && (
                  <HomeScreen
                    loginForm={loginForm}
                    setLoginForm={setLoginForm}
                    authForm={authForm}
                    setAuthForm={setAuthForm}
                    onLogin={handleLogin}
                    onCreateUser={handleRegister}
                    onGuest={() => {
                      setMode('guest')
                      setIsLogged(true)
                      setScreen('dashboard')
                      setMessage('Ingresaste como invitado. Acceso de visualización habilitado.')
                    }}
                    message={message}
                    onGoDashboard={() => setScreen('dashboard')}
                  />
                )}

                {screen === 'dashboard' && (
                  <DashboardScreen
                    level={level}
                    alert={currentAlert}
                    message={message}
                    selectedZone={selectedZone}
                    setSelectedZone={setSelectedZone}
                    onQuickAlert={activateAlert}
                    onAddReport={addReport}
                    recentAlerts={recentAlerts}
                    onOpenGps={openGps}
                  />
                )}

                {screen === 'alerts' && (
                  <AlertsScreen recentAlerts={recentAlerts} onQuickAlert={activateAlert} />
                )}

                {screen === 'zones' && (
                  <ZonesScreen
                    selectedZone={selectedZone}
                    setSelectedZone={setSelectedZone}
                    onOpenGps={openGps}
                    gpsOpen={gpsOpen}
                    gpsStep={gpsStep}
                    onCloseGps={closeGps}
                  />
                )}

                {screen === 'community' && (
                  <CommunityScreen reports={reports} onAddReport={addReport} />
                )}
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HeaderBar({ mode, level, alert, isLogged, onlineUsers, onNavigate }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#091427]/90 px-4 py-4 md:px-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl">
          🌊
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-cyan-200/70">SATD</p>
          <h1 className="text-lg font-black leading-tight md:text-2xl">Sistema de Alerta Temprana de Desbordamiento</h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <PillButton text={isLogged ? (mode === 'guest' ? 'Invitado' : 'Usuario activo') : 'Sin sesión'} active />
        <PillButton text={`Río ${level.toFixed(2)} m`} />
        <PillButton text={alert.title} tone={alert.tone} />
        <PillButton text={`${onlineUsers} conectados`} />
        <button onClick={() => onNavigate('home')} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10">
          Inicio
        </button>
      </div>
    </div>
  )
}

function Sidebar({ screen, setScreen, isLogged, level, alert, onQuickAlert, onAddReport }) {
  const nav = [
    { id: 'dashboard', label: 'Monitoreo' },
    { id: 'alerts', label: 'Alertas' },
    { id: 'zones', label: 'Zonas seguras' },
    { id: 'community', label: 'Comunidad' }
  ]

  return (
    <aside className="border-b border-white/10 bg-[#08111f] p-4 lg:border-b-0 lg:border-r lg:border-white/10">
      <div className="space-y-4">
        <div className="rounded-[28px] border border-cyan-900/60 bg-[#0b1528] p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/60">Panel rápido</p>
          <div className="mt-3 space-y-3">
            {nav.map(item => (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  screen === item.id ? 'bg-cyan-500 text-white' : 'bg-white/5 text-slate-200 hover:bg-white/10'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs opacity-70">›</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Acciones</p>
          <div className="mt-3 space-y-2">
            <button onClick={() => onQuickAlert('Amarilla')} className="w-full rounded-2xl bg-yellow-500/15 px-4 py-3 text-sm font-bold text-yellow-200 ring-1 ring-yellow-400/20 hover:bg-yellow-500/20">
              Alerta amarilla
            </button>
            <button onClick={() => onQuickAlert('Naranja')} className="w-full rounded-2xl bg-orange-500/15 px-4 py-3 text-sm font-bold text-orange-200 ring-1 ring-orange-400/20 hover:bg-orange-500/20">
              Alerta naranja
            </button>
            <button onClick={() => onQuickAlert('Roja')} className="w-full rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-bold text-red-200 ring-1 ring-red-400/20 hover:bg-red-500/20">
              Alerta roja
            </button>
            <button onClick={onAddReport} className="w-full rounded-2xl bg-cyan-500/15 px-4 py-3 text-sm font-bold text-cyan-100 ring-1 ring-cyan-400/20 hover:bg-cyan-500/20">
              Nuevo reporte
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Estado</p>
          <div className="mt-3 space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between rounded-2xl bg-black/20 px-3 py-2">
              <span>Sesion</span>
              <span className={isLogged ? 'text-emerald-300' : 'text-slate-400'}>{isLogged ? 'Activa' : 'No iniciada'}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-black/20 px-3 py-2">
              <span>Nivel</span>
              <span>{level.toFixed(2)} m</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-black/20 px-3 py-2">
              <span>Alerta</span>
              <span>{alert.title}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function HomeScreen({ loginForm, setLoginForm, authForm, setAuthForm, onLogin, onCreateUser, onGuest, message, onGoDashboard }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[34px] border border-cyan-900/50 bg-gradient-to-br from-[#08182f] via-[#0a2248] to-[#05101f] p-5 shadow-xl shadow-cyan-950/20 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Inicio</p>
            <h2 className="mt-2 text-3xl font-black md:text-5xl">Accede al sistema</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
              Pantalla de entrada con estilo de app real. Puedes iniciar sesión, crear usuario o entrar como invitado.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 px-4 py-3 text-right">
            <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/60">Simulación</p>
            <div className="mt-1 text-3xl font-black text-white">SATD</div>
            <p className="text-sm text-slate-300">River monitoring app</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="space-y-3 rounded-[28px] border border-white/10 bg-black/20 p-5">
            <p className="text-sm font-semibold text-cyan-100">Ingresar usuario existente</p>
            <input
              value={loginForm.email}
              onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-[#0b1528] px-4 py-3 text-sm outline-none focus:border-cyan-400"
              placeholder="Correo"
            />
            <input
              value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-[#0b1528] px-4 py-3 text-sm outline-none focus:border-cyan-400"
              placeholder="Contraseña"
            />
            <button onClick={onLogin} className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-bold hover:brightness-110">
              Ingresar
            </button>
          </div>

          <div className="space-y-3 rounded-[28px] border border-white/10 bg-black/20 p-5">
            <p className="text-sm font-semibold text-cyan-100">Crear usuario</p>
            <input
              value={authForm.name}
              onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-[#0b1528] px-4 py-3 text-sm outline-none focus:border-cyan-400"
              placeholder="Nombre"
            />
            <input
              value={authForm.email}
              onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-[#0b1528] px-4 py-3 text-sm outline-none focus:border-cyan-400"
              placeholder="Correo"
            />
            <input
              value={authForm.password}
              onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-[#0b1528] px-4 py-3 text-sm outline-none focus:border-cyan-400"
              placeholder="Contraseña"
            />
            <button onClick={onCreateUser} className="w-full rounded-2xl border border-cyan-400/20 bg-cyan-500/15 px-4 py-3 font-bold text-cyan-100 hover:bg-cyan-500/20">
              Crear usuario
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={onGuest} className="rounded-2xl bg-emerald-500 px-5 py-3 font-bold text-white hover:bg-emerald-400">
            Entrar como invitado
          </button>
          <button onClick={onGoDashboard} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold hover:bg-white/10">
            Ver panel
          </button>
        </div>
      </div>

      <div className="space-y-5 rounded-[34px] border border-white/10 bg-[#0b1526]/90 p-5 shadow-xl shadow-black/20 md:p-7">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Estado del sistema</p>
          <div className="mt-3 text-2xl font-black text-white">{message}</div>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Esta versión ya se comporta como app: botones, formularios, secciones y navegación interna.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <QuickStat title="Monitoreo" value="Activo" />
          <QuickStat title="Alertas" value="3" />
          <QuickStat title="Zonas" value="4" />
        </div>

        <div className="rounded-[28px] border border-cyan-900/40 bg-gradient-to-br from-[#08182f] to-[#06111f] p-5">
          <p className="text-sm text-cyan-100/70">Vista simulada del río</p>
          <div className="mt-4 h-44 overflow-hidden rounded-[28px] border border-cyan-300/10 bg-[#041020] p-4">
            <div className="flex h-full items-end gap-2">
              {[38, 42, 49, 55, 58, 64, 71, 78, 84, 91].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-2xl bg-gradient-to-t from-cyan-600 via-sky-500 to-cyan-300" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardScreen({ level, alert, message, selectedZone, setSelectedZone, onQuickAlert, onAddReport, recentAlerts, onOpenGps }) {
  const zones = [
    'Coliseo del Pueblo',
    'Unidad Deportiva',
    'Parque Las Banderas',
    'Santa Librada'
  ]

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <section className="rounded-[34px] border border-cyan-900/50 bg-gradient-to-br from-[#071a35] via-[#0a2550] to-[#06101f] p-6 shadow-xl shadow-cyan-950/20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Monitoreo en tiempo real</p>
              <h2 className="mt-2 text-3xl font-black md:text-5xl">Nivel actual del río</h2>
            </div>
            <div className={`rounded-full px-5 py-3 text-sm font-black ${alert.tone === 'red' ? 'bg-red-500' : alert.tone === 'orange' ? 'bg-orange-500' : 'bg-yellow-500'} text-white`}>
              {alert.title}
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_300px]">
            <div className="rounded-[30px] border border-white/10 bg-black/20 p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-cyan-100/70">Lectura simulada</p>
                  <div className="text-6xl font-black leading-none text-white">{level.toFixed(2)}m</div>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Estado</p>
                  <p className="mt-1 text-lg font-bold text-cyan-200">{alert.message}</p>
                </div>
              </div>

              <div className="mt-5 h-36 overflow-hidden rounded-[28px] border border-cyan-300/10 bg-[#041020] p-4">
                <div className="flex h-full items-end gap-2">
                  {[28, 36, 44, 50, 60, 68, 76, 88, 82, 94].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-2xl bg-gradient-to-t from-cyan-600 via-sky-500 to-cyan-300" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-[30px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-cyan-100">Acciones rápidas</p>
              <button onClick={() => onQuickAlert('Amarilla')} className="w-full rounded-2xl bg-yellow-500/15 px-4 py-3 text-sm font-bold text-yellow-200 ring-1 ring-yellow-400/20 hover:bg-yellow-500/20">
                Activar amarilla
              </button>
              <button onClick={() => onQuickAlert('Naranja')} className="w-full rounded-2xl bg-orange-500/15 px-4 py-3 text-sm font-bold text-orange-200 ring-1 ring-orange-400/20 hover:bg-orange-500/20">
                Activar naranja
              </button>
              <button onClick={() => onQuickAlert('Roja')} className="w-full rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-bold text-red-200 ring-1 ring-red-400/20 hover:bg-red-500/20">
                Activar roja
              </button>
              <button onClick={onAddReport} className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-bold text-white hover:bg-cyan-400">
                Nuevo reporte
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Sensor" value="Radar" />
          <MetricCard label="Humedad" value="92%" />
          <MetricCard label="Conectividad" value="LoRaWAN" />
          <MetricCard label="Energía" value="Solar" />
        </section>

        <section className="rounded-[34px] border border-white/10 bg-[#0a1528]/90 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Zonas seguras</p>
              <h3 className="mt-2 text-2xl font-black">Rutas y puntos de apoyo</h3>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
              Simulación activa
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {zones.map((z, i) => (
              <button
                key={z}
                onClick={() => setSelectedZone(i)}
                className={`rounded-[28px] border px-4 py-4 text-left transition ${selectedZone === i ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{z}</p>
                    <p className="text-sm text-slate-400">Zona segura ·  {['1.2 km', '1.5 km', '2.1 km', '2.4 km'][i]}</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">Ir</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="rounded-[34px] border border-white/10 bg-[#0b1526]/90 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Alerta actual</p>
          <div className={`mt-3 rounded-[28px] p-5 ${alert.tone === 'red' ? 'bg-red-500/15 ring-1 ring-red-400/20' : alert.tone === 'orange' ? 'bg-orange-500/15 ring-1 ring-orange-400/20' : 'bg-yellow-500/15 ring-1 ring-yellow-400/20'}`}>
            <div className="text-3xl font-black text-white">{alert.title}</div>
            <p className="mt-3 text-sm leading-6 text-slate-200">{alert.message}</p>
          </div>
          <div className="mt-4 rounded-[26px] border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-300">{message}</p>
          </div>
        </section>

        <section className="rounded-[34px] border border-white/10 bg-[#0b1526]/90 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Alertas recientes</p>
          <div className="mt-4 space-y-3">
            {recentAlerts.map((item, i) => (
              <div key={i} className="rounded-[26px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{item.type}</p>
                    <p className="text-sm text-slate-400">{item.text}</p>
                  </div>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  )
}

function AlertsScreen({ recentAlerts, onQuickAlert }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-[34px] border border-white/10 bg-[#0a1528]/90 p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Alertas tempranas</p>
        <h2 className="mt-2 text-3xl font-black">Panel de emergencias</h2>
        <div className="mt-5 space-y-4">
          <AlertCard tone="red" title="Alerta Roja" subtitle="Evacuación inmediata" detail="El nivel del río supera el límite crítico." />
          <AlertCard tone="orange" title="Alerta Naranja" subtitle="Listos para evacuar" detail="Preparar rutas y elementos de emergencia." />
          <AlertCard tone="yellow" title="Alerta Amarilla" subtitle="Preparación" detail="Mantener vigilancia y escuchar avisos." />
        </div>
      </section>

      <section className="rounded-[34px] border border-white/10 bg-[#0b1526]/90 p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Botones</p>
        <div className="mt-4 space-y-3">
          <button onClick={() => onQuickAlert('Amarilla')} className="w-full rounded-2xl bg-yellow-500/15 px-4 py-3 text-sm font-bold text-yellow-200 ring-1 ring-yellow-400/20 hover:bg-yellow-500/20">
            Simular amarilla
          </button>
          <button onClick={() => onQuickAlert('Naranja')} className="w-full rounded-2xl bg-orange-500/15 px-4 py-3 text-sm font-bold text-orange-200 ring-1 ring-orange-400/20 hover:bg-orange-500/20">
            Simular naranja
          </button>
          <button onClick={() => onQuickAlert('Roja')} className="w-full rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-bold text-red-200 ring-1 ring-red-400/20 hover:bg-red-500/20">
            Simular roja
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {recentAlerts.map((item, i) => (
            <div key={i} className="rounded-[26px] border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">{item.type}</p>
              <p className="text-sm text-slate-400">{item.text}</p>
              <p className="mt-1 text-xs text-slate-500">{item.time}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ZonesScreen({ selectedZone, setSelectedZone, onOpenGps, gpsOpen, gpsStep, onCloseGps }) {
  const selected = safeZones[selectedZone]

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="rounded-[34px] border border-white/10 bg-[#0a1528]/90 p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Zonas seguras</p>
        <h2 className="mt-2 text-3xl font-black">Mapa de apoyo y refugio</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {safeZones.map((z, i) => (
            <button
              key={z.name}
              onClick={() => setSelectedZone(i)}
              className={`rounded-[28px] border p-5 text-left transition ${selectedZone === i ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-white">{z.name}</h3>
                  <p className="mt-2 text-sm text-slate-400">{z.distance} · {z.status}</p>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">Seguro</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenGps(i)
                }}
                className="mt-4 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-black text-white hover:bg-emerald-400"
              >
                Ver ruta GPS
              </button>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[34px] border border-white/10 bg-[#0b1526]/90 p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">GPS simulado</p>
        <div className="mt-4 rounded-[30px] border border-emerald-400/10 bg-[radial-gradient(circle_at_30%_35%,rgba(74,222,128,0.22),transparent_24%),radial-gradient(circle_at_70%_55%,rgba(16,185,129,0.25),transparent_24%),linear-gradient(180deg,#0a2230_0%,#08131f_100%)] p-5">
          <div className="h-56 rounded-[26px] border border-white/10 bg-black/20 p-4">
            <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[22px] border border-emerald-300/10 bg-[#03101b] text-center text-slate-300">
              <div className="absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/20 animate-pulse" />
                <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/30" />
              </div>

              <div className="relative z-10">
                <div className="text-5xl">📍</div>
                <p className="mt-3 text-xl font-black text-white">{selected.name}</p>
                <p className="mt-1 text-sm text-slate-400">{selected.distance} · {selected.status}</p>
                <p className="mt-4 text-sm text-emerald-300">GPS activo · ruta calculada</p>
              </div>
            </div>
          </div>
        </div>

        {gpsOpen && (
          <div className="mt-4 rounded-[28px] border border-emerald-400/20 bg-emerald-500/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-100/70">Cómo llegar</p>
                <h3 className="mt-1 text-lg font-black text-white">Ruta guiada paso a paso</h3>
              </div>
              <button onClick={onCloseGps} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10">
                Cerrar
              </button>
            </div>

            <div className="mt-4 rounded-[24px] border border-white/10 bg-[#05111d] p-4">
              <p className="text-sm text-slate-300">Paso actual:</p>
              <p className="mt-2 text-lg font-bold text-white">{selected.route[gpsStep]}</p>
              <div className="mt-4 space-y-2">
                {selected.route.map((step, i) => (
                  <div key={i} className={`rounded-2xl px-3 py-2 text-sm ${i === gpsStep ? 'bg-emerald-500/20 text-emerald-200' : 'bg-white/5 text-slate-300'}`}>
                    {i + 1}. {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function CommunityScreen({ reports, onAddReport }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-[34px] border border-white/10 bg-[#0a1528]/90 p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Comunidad informa</p>
        <h2 className="mt-2 text-3xl font-black">Reportes ciudadanos</h2>
        <div className="mt-5 space-y-3">
          {reports.map((r, i) => (
            <div key={i} className="rounded-[26px] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{r.title}</p>
                  <p className="text-sm text-slate-400">{r.place}</p>
                </div>
                <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-200">{r.state}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[34px] border border-white/10 bg-[#0b1526]/90 p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Acciones</p>
        <button onClick={onAddReport} className="mt-4 w-full rounded-2xl bg-cyan-500 px-4 py-3 font-bold text-white hover:bg-cyan-400">
          Crear reporte simulado
        </button>
        <div className="mt-5 rounded-[28px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300 leading-6">
          Los reportes son simulados para mostrar una experiencia interactiva dentro de la app.
        </div>
      </section>
    </div>
  )
}

function QuickStat({ title, value }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{title}</p>
      <div className="mt-2 text-3xl font-black text-cyan-300">{value}</div>
    </div>
  )
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <div className="mt-2 text-2xl font-black text-white">{value}</div>
    </div>
  )
}

function AlertCard({ tone, title, subtitle, detail }) {
  const colors = {
    red: 'border-red-400/20 bg-red-500/10',
    orange: 'border-orange-400/20 bg-orange-500/10',
    yellow: 'border-yellow-400/20 bg-yellow-500/10'
  }

  return (
    <div className={`rounded-[30px] border p-5 ${colors[tone]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{subtitle}</p>
          <h3 className="mt-2 text-2xl font-black text-white">{title}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">{detail}</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-white">{tone.toUpperCase()}</div>
      </div>
    </div>
  )
}

function PillButton({ text, tone, active }) {
  const toneClass =
    tone === 'red'
      ? 'border-red-400/20 bg-red-500/10 text-red-200'
      : tone === 'orange'
        ? 'border-orange-400/20 bg-orange-500/10 text-orange-200'
        : tone === 'yellow'
          ? 'border-yellow-400/20 bg-yellow-500/10 text-yellow-200'
          : active
            ? 'border-cyan-400/20 bg-cyan-500/10 text-cyan-100'
            : 'border-white/10 bg-white/5 text-slate-200'

  return <span className={`rounded-full border px-4 py-2 text-sm font-semibold ${toneClass}`}>{text}</span>
}
