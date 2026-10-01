/**
 * Contenido del portfolio. Fuente unica de verdad.
 *
 * REGLA: cada dato de aqui viene del CV (CV-2026-ES.md / CV-2026-EN.md).
 * No se inventa ninguna metrica, cliente, fecha, certificacion ni contacto.
 * Si un dato no esta verificado, va como `null` y el render se apaga, en vez
 * de rellenarlo con algo que parezca real.
 *
 * El sitio es bilingue. Las dos variantes deben cubrir exactamente las mismas
 * claves: `scripts/check-content.ts` falla el build si una idioma tiene una
 * seccion que el otro no. Un portfolio medio traducido se delata al instante.
 */

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "es" || value === "en";
}

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  es: "ES",
};

export const LOCALE_PATH: Record<Locale, string> = {
  en: "/en",
  es: "/es",
};

// ----------------------------------------------------------------------------
// Identidad
// ----------------------------------------------------------------------------

export const person = {
  name: "Dennis Pineda Licona",
  initials: "DP",
  location: { es: "Lima, Perú", en: "Lima, Peru" },
  email: "dannuzp@gmail.com",
  phone: "983233483",
  linkedin: "https://linkedin.com/in/dnniz",
  github: "https://github.com/dnniz",
} as const;

export type T = {
  hero: {
    eyebrow: string;
    headline: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  metrics: { value: string; label: string }[];
  about: { heading: string; body: string[] };
  work: {
    heading: string;
    lead: string;
    featured: string;
    rest: string;
    viewCv: string;
    stackLabel: string;
    // Plantilla con dos huecos: destacados visibles y total. "de" no puede
    // ir en el JSX: en la pagina inglesa saldria "4 de 13".
    shownOf: string;
    // Plantilla con dos huecos: cuantos destacados y cuantos hay en total.
    // "de" no se puede escribir en el JSX: en la pagina inglesa sale "4 de 13".
  };
  stack: { heading: string; lead: string };
  ai: { heading: string; body: string[]; items: { title: string; body: string }[] };
  credentials: {
    heading: string;
    certifications: string;
    education: string;
    languages: string;
    courses: string;
  };
  contact: {
    email: string;
    phone: string;
    profiles: string;
    heading: string;
    body: string;
    primary: string;
    copyEmail: string;
    copied: string;
  };
  nav: { about: string; work: string; stack: string; ai: string; credentials: string; contact: string };
  cv: {
    title: string;
    download: string;
    back: string;
    print: string;
    summary: string;
    experience: string;
  };
  a11y: { toggleTheme: string; toggleLang: string; skipToContent: string; openMenu: string };
};

// ----------------------------------------------------------------------------
// Copy por idioma
// ----------------------------------------------------------------------------

export const copy: Record<Locale, T> = {
  en: {
    hero: {
      eyebrow: "Senior Full-Stack Developer",
      headline: "Backend systems that reach production and stay there.",
      sub: "Nine years turning vague client problems into .NET and Node.js services, across banking, telecom and energy.",
      ctaPrimary: "Get in touch",
      ctaSecondary: "Read the CV",
    },
    metrics: [
      { value: "9", label: "years in production" },
      { value: "13", label: "projects delivered" },
      { value: "1M+", label: "active wallet users served" },
      { value: "40+", label: "fixes shipped in critical state" },
    ],
    about: {
      heading: "What I actually do",
      body: [
        "I shipped my first production system a few weeks after leaving school. That was 2017, on a Critical Operations project at COES. Nine years later the part I enjoy most has not changed: turning a vague client problem into code that runs in production.",
        "I build backend systems with .NET and Node.js, and I write Angular or React Native when the stack calls for it. At Baufest I owned the SAP gateway microservice at Cosmos, a role that sits between the business owner and the technical team: translating what the client actually needs, building the API, and staying through deployment.",
        "When something breaks I dig for the root cause first, then come back with options. A fix done well gets documented so it does not come back.",
      ],
    },
    work: {
      heading: "Selected work",
      lead: "Thirteen projects across banking, telecom, energy, retail and logistics. These are the ones with the most interesting constraint.",
      featured: "Featured",
      rest: "Everything else",
      viewCv: "Full CV",
      stackLabel: "Stack",
      shownOf: "{n} of {total}",
    },
    stack: {
      heading: "What I work with",
      lead: "Backend is where I spend most of my time. The rest shows up when the product needs a screen.",
    },
    ai: {
      heading: "AI in the workflow, not on the slide",
      body: [
        "AI has been part of how I work for the last year, applied to real production tasks rather than to demos.",
      ],
      items: [
        {
          title: "Internal skills",
          body: "Reusable instruction sets that encode how this codebase is actually built, so the work does not restart from zero each time.",
        },
        {
          title: "MCP servers",
          body: "Tooling that connects the models to the systems I already use, turning a prompt into an action that lands in the repository.",
        },
        {
          title: "Harness wrappers",
          body: "Wrappers around GitHub Copilot that shortened iteration cycles on production tasks, from reading the diff to running the checks.",
        },
      ],
    },
    credentials: {
      heading: "Credentials",
      certifications: "Certifications",
      education: "Education",
      languages: "Languages",
      courses: "Courses",
    },
    contact: {
      email: "Email",
      phone: "Phone",
      profiles: "Profiles",
      heading: "Let's talk",
      body: "Open to backend roles, remote, for LATAM or for United States teams hiring Latin American talent.",
      primary: "Write to me",
      copyEmail: "Copy email",
      copied: "Copied",
    },
    nav: {
      about: "About",
      work: "Work",
      stack: "Stack",
      ai: "AI tooling",
      credentials: "Credentials",
      contact: "Contact",
    },
    cv: {
      title: "Curriculum Vitae",
      download: "Download PDF",
      back: "Back to portfolio",
      print: "Print",
      summary: "Profile",
      experience: "Experience",
    },
    a11y: {
      toggleTheme: "Toggle colour theme",
      toggleLang: "Change language",
      skipToContent: "Skip to content",
      openMenu: "Open menu",
    },
  },

  es: {
    hero: {
      eyebrow: "Senior Full-Stack Developer",
      headline: "Backends que llegan a producción y se quedan.",
      sub: "Nueve años convirtiendo problemas vagos de cliente en servicios .NET y Node.js, en banca, telecomunicaciones y energía.",
      ctaPrimary: "Escríbeme",
      ctaSecondary: "Leer el CV",
    },
    metrics: [
      { value: "9", label: "años en producción" },
      { value: "13", label: "proyectos entregados" },
      { value: "1M+", label: "usuarios activos atendidos" },
      { value: "40+", label: "correcciones de urgencia" },
    ],
    about: {
      heading: "Lo que hago realmente",
      body: [
        "Desarrollé mi primer sistema de producción semanas después de salir del instituto. Fue en 2017, en un proyecto de Critical Operations en COES. Nueve años después, lo que más me gusta hacer no ha cambiado: convertir un problema vago del cliente en código que corre en producción.",
        "Construyo backends con .NET y Node.js, y escribo Angular o React Native cuando el stack lo pide. En Baufest fui dueño del microservicio Gateway SAP en Cosmos, un rol que se ubica entre el product owner y el equipo técnico: traduce lo que el cliente realmente necesita, construye la API y acompaña hasta el despliegue.",
        "Cuando algo se rompe, busco la causa raíz primero y después vuelvo con opciones. Un fix bien hecho se documenta para que no vuelva a aparecer.",
      ],
    },
    work: {
      heading: "Trabajo seleccionado",
      lead: "Trece proyectos en banca, telecomunicaciones, energía, retail y logística. Estos son los que tienen la restricción más interesante.",
      featured: "Destacados",
      rest: "Todo lo demás",
      viewCv: "CV completo",
      stackLabel: "Stack",
      shownOf: "{n} de {total}",
    },
    stack: {
      heading: "Con qué trabajo",
      lead: "El backend es donde paso la mayor parte del tiempo. Lo demás aparece cuando el producto necesita pantalla.",
    },
    ai: {
      heading: "IA en el flujo, no en la diapositiva",
      body: [
        "La IA ha formado parte de mi forma de trabajar durante el último año, aplicada a tareas reales de producción y no a demos.",
      ],
      items: [
        {
          title: "Skills internas",
          body: "Conjuntos de instrucciones reutilizables que codifican cómo se construye realmente este código, para que el trabajo no empiece de cero cada vez.",
        },
        {
          title: "Servidores MCP",
          body: "Herramientas que conectan los modelos con los sistemas que ya uso, convirtiendo un prompt en una acción que aterriza en el repositorio.",
        },
        {
          title: "Wrappers de harness",
          body: "Wrappers alrededor de GitHub Copilot que acortaron los ciclos de iteración en tareas de producción, desde leer el diff hasta correr los checks.",
        },
      ],
    },
    credentials: {
      heading: "Credenciales",
      certifications: "Certificaciones",
      education: "Formación",
      languages: "Idiomas",
      courses: "Cursos",
    },
    contact: {
      email: "Correo",
      phone: "Telefono",
      profiles: "Perfiles",
      heading: "Hablemos",
      body: "Disponible para roles de backend remotos, en LATAM o para equipos de Estados Unidos que contratan talento latinoamericano.",
      primary: "Escríbeme",
      copyEmail: "Copiar email",
      copied: "Copiado",
    },
    nav: {
      about: "Sobre mí",
      work: "Trabajo",
      stack: "Stack",
      ai: "Herramientas de IA",
      credentials: "Credenciales",
      contact: "Contacto",
    },
    cv: {
      title: "Curriculum Vitae",
      download: "Descargar PDF",
      back: "Volver al portfolio",
      print: "Imprimir",
      summary: "Perfil",
      experience: "Experiencia",
    },
    a11y: {
      toggleTheme: "Cambiar tema de color",
      toggleLang: "Cambiar idioma",
      skipToContent: "Ir al contenido",
      openMenu: "Abrir menú",
    },
  },
};

// ----------------------------------------------------------------------------
// Experiencia
// ----------------------------------------------------------------------------

export type Role = {
  id: string;
  company: string;
  client: string | null;
  title: { es: string; en: string };
  sector: { es: string; en: string };
  period: { es: string; en: string };
  duration: { es: string; en: string };
  stack: string[];
  /** Los cuatro bullets del CV, sin recortar. */
  bullets: { es: string[]; en: string[] };
  featured: boolean;
};

/**
 * El orden es cronologico inverso, igual que el CV. Los `featured` son los
 * cuatro con la restriccion tecnica mas interesante: propiedad de un
 * microservicio de integracion, un modulo de fidelizacion a escala de
 * millones de usuarios, integracion de datos en banca y una migracion
 * transaccional masiva en telecomunicaciones.
 */
export const roles: Role[] = [
  {
    id: "baufest-cosmos",
    company: "Baufest",
    client: "Cosmos",
    title: { es: "Backend Developer, Gateway SAP", en: "Backend Developer, SAP Gateway" },
    sector: { es: "Banca, integración fiscal", en: "Banking, tax integration" },
    period: { es: "Dic 2025 - Sep 2026", en: "Dec 2025 - Sep 2026" },
    duration: { es: "10 meses", en: "10 mos" },
    stack: ["C#", ".NET", "Azure App Service", "Angular", "SQL Server"],
    bullets: {
      es: [
        "Asumí desde cero el microservicio Gateway SAP, hasta su integración en producción con los sistemas internos de Cosmos.",
        "Desarrollé APIs backend en C# / .NET sobre Azure App Service, integradas con el front end de Angular + TypeScript y SQL Server.",
        "Diseñé el contrato de integración para la conectividad con SUNAT y SAP, habilitando la automatización de importación y exportación a escala (millones de transacciones proyectadas anualmente).",
        "Coordiné directamente con los proveedores de SAP y SUNAT para alinear contratos de integración, seguridad y cadencia de entrega.",
      ],
      en: [
        "Took ownership of the SAP gateway microservice from scratch through production integration with Cosmos internal systems.",
        "Built backend APIs in C# / .NET on Azure App Service, integrated with the Angular + TypeScript front end and SQL Server.",
        "Designed the integration contract for SUNAT and SAP connectivity to enable import/export automation at scale (millions of transactions projected annually).",
        "Coordinated directly with the SAP and SUNAT providers to align integration contracts, security, and delivery cadence.",
      ],
    },
    featured: true,
  },
  {
    id: "baufest-puerto-coronel",
    company: "Baufest",
    client: "Transdepot",
    title: { es: "Backend Developer", en: "Backend Developer" },
    sector: { es: "Logística, producto nuevo", en: "Logistics, new product" },
    period: { es: "Ene 2025 - Nov 2025", en: "Jan 2025 - Nov 2025" },
    duration: { es: "10 meses", en: "10 mos" },
    stack: ["C#", ".NET Web API", "ASP.NET MVC", "Azure App Service"],
    bullets: {
      es: [
        "Desarrollé el producto Transdepot de principio a fin con C# / .NET Web API y ASP.NET MVC, publicado en Azure App Service con una capa de seguridad.",
        "Trabaje los requerimientos con los owners del negocio y convertí cada uno en una tarea de entrega.",
        "Documenté requerimientos funcionales, casos de uso y contratos de API a lo largo del proyecto.",
      ],
      en: [
        "Developed Transdepot end to end with C# / .NET Web API and ASP.NET MVC, published on Azure App Service with a security layer in front.",
        "Worked requirements with the business owners and turned each one into a delivery task.",
        "Documented functional requirements, use cases, and API contracts across the project.",
      ],
    },
    featured: false,
  },
  {
    id: "baufest-bcp",
    company: "Baufest",
    client: "Banco de Crédito del Perú",
    title: { es: "Backend Developer, pipelines de datos y BI", en: "Backend Developer, data pipelines and BI" },
    sector: { es: "Banca, riesgo de crédito", en: "Banking, credit risk" },
    period: { es: "Jul 2024 - Dic 2024", en: "Jul 2024 - Dec 2024" },
    duration: { es: "5 meses", en: "5 mos" },
    stack: ["Azure Data Factory", "Bash", "Power BI"],
    bullets: {
      es: [
        "Automaticé 20 documentos por día con Azure Data Factory y scripts de Bash shell para los equipos de fraude y riesgo de crédito del BCP (aproximadamente 2,200 documentos a lo largo de los 5 meses del proyecto).",
        "Tomé la transferencia de conocimiento del equipo de ingeniería saliente y entregué desarrollos continuos a producción cumpliendo los criterios de proceso del banco.",
        "Mantuve reportes de Power BI que los analistas de fraude y riesgo de crédito usaban para monitorear señales del modelo y cambios de riesgo.",
        "Coordiné con los equipos de ingeniería de datos y de riesgo del BCP para validar las salidas del pipeline contra los modelos de fraude y riesgo crediticio en producción.",
      ],
      en: [
        "Automated 20 documents per day through Azure Data Factory and Bash shell scripts for the BCP fraud and credit-risk teams (approximately 2,200 documents across the 5-month engagement).",
        "Took over the knowledge transfer from the outgoing engineering team and shipped ongoing developments to production against the bank's process criteria.",
        "Maintained Power BI reports that the BCP fraud and credit-risk analysts used to monitor model signals and risk changes.",
        "Coordinated with the BCP data engineering and risk teams to validate pipeline outputs against fraud and credit-risk models in production.",
      ],
    },
    featured: true,
  },
  {
    id: "baufest-don-mario",
    company: "Baufest",
    client: "Don Mario",
    title: { es: "Backend Developer, API .NET Core", en: "Backend Developer, .NET Core API" },
    sector: { es: "Retail, integración externa", en: "Retail, external integration" },
    period: { es: "Nov 2023 - May 2024", en: "Nov 2023 - May 2024" },
    duration: { es: "7 meses", en: "7 mos" },
    stack: ["C#", ".NET Core 8", "Azure App Service"],
    bullets: {
      es: [
        "Construí la API desde cero en .NET Core 8, publicada en Azure App Service con una capa de seguridad.",
        "Trabaje requerimientos con los owners del negocio, incluyendo llamadas de coordinación con el equipo del cliente externo.",
      ],
      en: [
        "Built the API from scratch in .NET Core 8, published on Azure App Service with a security layer in front.",
        "Worked requirements with the business owners, including coordination calls with the external client team.",
      ],
    },
    featured: false,
  },
  {
    id: "baufest-personal-pay",
    company: "Baufest",
    client: "TELECOM Personal Pay",
    title: { es: "Senior Backend Developer, microservicios", en: "Senior Backend Developer, microservices" },
    sector: { es: "Telecom, fidelización", en: "Telecom, loyalty" },
    period: { es: "Sep 2021 - Oct 2023", en: "Sep 2021 - Oct 2023" },
    duration: { es: "2 años 2 meses", en: "2 yrs 2 mos" },
    stack: ["Node.js", "Nest.js", "TypeScript", "PostgreSQL", "DDD", "EDA"],
    bullets: {
      es: [
        "Lideré el módulo de fidelización como referente Senior Backend, a cargo de promociones, cashback automático y banners in-app en los flujos de cara al consumidor.",
        "Construí microservicios con Node.js, Nest.js, TypeScript y PostgreSQL sobre una Event-Driven Architecture con límites DDD.",
        "Realicé revisiones de arquitectura en cada ciclo con el equipo de plataforma para validar soluciones y mejoras.",
        "Coordiné entregas dentro del equipo y con integradores externos para releases que llegaron a más de 1M de usuarios activos del wallet.",
      ],
      en: [
        "Led the loyalty module as Senior Backend reference, owning promotions, automatic cashback, and in-app banners on the consumer-facing flows.",
        "Built microservices with Node.js, Nest.js, TypeScript, and PostgreSQL on an Event-Driven Architecture with DDD boundaries.",
        "Ran architecture reviews each cycle with the platform team to validate solutions and improvements.",
        "Coordinated delivery across the squad and with external integrators for releases that landed in front of 1M+ active wallet users.",
      ],
    },
    featured: true,
  },
  {
    id: "baufest-american-logistics",
    company: "Baufest",
    client: "American Logistics",
    title: { es: "Mobile Developer", en: "Mobile Developer" },
    sector: { es: "Logística, app de transporte", en: "Logistics, transport app" },
    period: { es: "Abr 2021 - Ago 2021", en: "Apr 2021 - Aug 2021" },
    duration: { es: "5 meses", en: "5 mos" },
    stack: ["React Native", "Redux", "WCAG"],
    bullets: {
      es: [
        "Construí y mantuve componentes reutilizables para la app de transporte en React Native con Redux.",
        "Validé el uso de accesibilidad contra WCAG y apliqué correcciones para mantener la app usable.",
        "Participé en reuniones con el cliente para requerimientos y feedback durante el proyecto.",
      ],
      en: [
        "Built and maintained reusable components for the transport app in React Native with Redux.",
        "Validated accessibility usage against WCAG and pushed fixes to keep the app usable.",
        "Joined client meetings for requirements and feedback throughout the engagement.",
      ],
    },
    featured: false,
  },
  {
    id: "baufest-solgas",
    company: "Baufest",
    client: "SOLGAS",
    title: { es: "Backend Developer", en: "Backend Developer" },
    sector: { es: "Energía, generación de rutas", en: "Energy, route generation" },
    period: { es: "Ene 2021 - Mar 2021", en: "Jan 2021 - Mar 2021" },
    duration: { es: "3 meses", en: "3 mos" },
    stack: ["C#", ".NET Core", "ASP.NET MVC", "REST"],
    bullets: {
      es: [
        "Construí la nueva aplicación web Despachador desde requerimientos hasta la entrega en Kanban.",
        "Desarrollé e integré nuevas APIs RESTful en .NET Core y ASP.NET MVC contra el sistema existente.",
        "Analicé y prioricé tareas, y documenté requerimientos funcionales y casos de uso para la release.",
      ],
      en: [
        "Built the new Despachador web application from requirements through Kanban delivery.",
        "Developed and integrated new RESTful APIs in .NET Core and ASP.NET MVC against the existing system.",
        "Analyzed and prioritized tasks, then documented functional requirements and use cases for the release.",
      ],
    },
    featured: false,
  },
  {
    id: "baufest-umar",
    company: "Baufest",
    client: "UMAR",
    title: { es: "Backend Developer", en: "Backend Developer" },
    sector: { es: "Industria, integraciones externas", en: "Industry, external integrations" },
    period: { es: "Sep 2020 - Dic 2020", en: "Sep 2020 - Dec 2020" },
    duration: { es: "4 meses", en: "4 mos" },
    stack: ["C#", ".NET Web API", "ASP.NET MVC", "SCRUM"],
    bullets: {
      es: [
        "Diseñé y analicé requerimientos de nuevas funcionalidades en el sistema UMAR.",
        "Desarrollé e integré con servicios externos mediante C# / .NET Web APIs y ASP.NET MVC.",
        "Mantuve la estabilidad de la aplicación en los ambientes desplegados durante el proyecto.",
      ],
      en: [
        "Designed and analyzed requirements for new functionalities in the UMAR system.",
        "Developed and integrated with external services through C# / .NET Web APIs and ASP.NET MVC.",
        "Maintained application stability across the deployed environments throughout the engagement.",
      ],
    },
    featured: false,
  },
  {
    id: "freelance-edpyme",
    company: "Freelance",
    client: "Edpyme Alternativa",
    title: { es: "Mobile Developer, React Native", en: "Mobile Developer, React Native" },
    sector: { es: "Servicios financieros", en: "Financial services" },
    period: { es: "Ene 2020 - Ago 2020", en: "Jan 2020 - Aug 2020" },
    duration: { es: "8 meses", en: "8 mos" },
    stack: ["React Native", "Expo", "REST"],
    bullets: {
      es: [
        "Construí una aplicación en React Native con Expo para un cliente de servicios financieros, incluyendo nuevos formularios de registro y mantenimiento de funcionalidades.",
        "Diseñé nuevos formularios y definí los flujos de usuario para la experiencia móvil.",
        "Integré APIs RESTful para alimentar la capa de datos de la aplicación.",
      ],
      en: [
        "Built a React Native application with Expo for a financial services client, including new intake forms and feature maintenance.",
        "Designed new forms and shaped the user flows for the mobile experience.",
        "Integrated RESTful APIs to drive the application's data layer.",
      ],
    },
    featured: false,
  },
  {
    id: "everis-repsol",
    company: "Everis",
    client: "Repsol",
    title: { es: "Backend Developer", en: "Backend Developer" },
    sector: { es: "Energía, programa de fidelización", en: "Energy, loyalty programme" },
    period: { es: "Jul 2019 - Ago 2020", en: "Jul 2019 - Aug 2020" },
    duration: { es: "1 año 2 meses", en: "1 yr 2 mos" },
    stack: ["ASP.NET WebForms", "Web API", "SCRUM"],
    bullets: {
      es: [
        "Refiné historias de usuario con el product owner e integré entregables a producción siguiendo la cadencia de sprints.",
        "Conecté la superficie legada ASP.NET WebForms con endpoints Web API modernos en el mismo código, para mantener el programa de fidelización en marcha.",
        "Apoyé en las ceremonias SCRUM diarias y aporté a la mejora de procesos del equipo.",
      ],
      en: [
        "Refined user stories with the product owner and integrated deliverables to production against the sprint cadence.",
        "Bridged the legacy ASP.NET WebForms surface and modern Web API endpoints in the same codebase to keep the loyalty program running.",
        "Supported daily SCRUM ceremonies and contributed to team process improvements.",
      ],
    },
    featured: false,
  },
  {
    id: "everis-claro",
    company: "Everis",
    client: "Claro",
    title: { es: ".NET Analyst Programmer", en: ".NET Analyst Programmer" },
    sector: { es: "Telecom, back office", en: "Telecom, back office" },
    period: { es: "Jul 2018 - Jun 2019", en: "Jul 2018 - Jun 2019" },
    duration: { es: "1 año", en: "1 yr" },
    stack: ["ASP.NET WebForms", "Oracle PL/SQL", "Waterfall"],
    bullets: {
      es: [
        "Analicé funcionalidades existentes y evalué riesgos para la migración de módulos en las aplicaciones internas de Claro.",
        "Diseñé e implementé cambios para procesos de cambio de titularidad masiva y validación de parámetros en flujos biométricos, que tocaron millones de transacciones de líneas prepago.",
        "Delegué tareas en el equipo, supervisé entregables y brindé soporte durante los pases a producción.",
        "Ejecuté pruebas funcionales y documenté cada desarrollo para la aprobación de QA.",
      ],
      en: [
        "Analyzed existing features and evaluated risks for module migration in Claro's internal apps.",
        "Designed and implemented changes for mass titular change and biometric parameter validation flows that touched millions of prepago line transactions.",
        "Delegated tasks across the team, supervised deliverables, and gave support during production rollouts.",
        "Ran functional tests and documented every development for QA sign-off.",
      ],
    },
    featured: true,
  },
  {
    id: "itsight-promart",
    company: "ITSight Consulting",
    client: "Promart / VANET Tasaciones",
    title: { es: ".NET Developer", en: ".NET Developer" },
    sector: { es: "Retail, plataforma de tasaciones", en: "Retail, valuation platform" },
    period: { es: "Ene 2018 - Jun 2018", en: "Jan 2018 - Jun 2018" },
    duration: { es: "6 meses", en: "6 mos" },
    stack: ["C#", "Web API", "Entity Framework", "SQL Server"],
    bullets: {
      es: [
        "Construí la web API que atendía el backlog de funcionalidades del frontend de Promart Copacapa.",
        "Construí la plataforma VANET Tasaciones con flujos de tasación paralelos por usuario y empresa, usando Entity Framework (Code First).",
        "Conecté notificaciones automáticas por correo y flujos de solicitud que respetaban el perfil de cada usuario.",
      ],
      en: [
        "Built the web API that served Promart Copacapa's frontend feature backlog.",
        "Built the VANET Tasaciones platform with parallel valuation flows per user and company, using Entity Framework (Code First).",
        "Wired automated email notifications and request flows that respected each user's profile.",
      ],
    },
    featured: false,
  },
  {
    id: "movisoft-coes",
    company: "Movisoft",
    client: "COES",
    title: { es: "Junior .NET Developer, primer puesto", en: "Junior .NET Developer, first role" },
    sector: { es: "Energía, reportes sobre Oracle", en: "Energy, reporting on Oracle" },
    period: { es: "Jul 2017 - Dic 2017", en: "Jul 2017 - Dec 2017" },
    duration: { es: "6 meses", en: "6 mos" },
    stack: ["C#", ".NET", "Oracle", "Highcharts", "Handsontable"],
    bullets: {
      es: [
        "Construí reportes exportables a Excel para SIOSEIN consultando archivos XML contra la base de datos Oracle.",
        "Desarrollé reportes gráficos con la librería Highcharts.",
        "Construí pantallas CRUD para nuevas tablas y un reporte ExcelWeb con Handsontable para el módulo Indisponibilidades.",
      ],
      en: [
        "Built exportable Excel reports for SIOSEIN by querying XML files against the Oracle database.",
        "Wrote graphical reports using Highcharts.",
        "Built CRUD screens for new tables and an ExcelWeb report with Handsontable for the Indisponibilidades module.",
      ],
    },
    featured: false,
  },
];

// ----------------------------------------------------------------------------
// Stack
// ----------------------------------------------------------------------------

export type StackGroup = {
  id: string;
  label: { es: string; en: string };
  items: { name: string; icon: string | null }[];
};

export const stackGroups: StackGroup[] = [
  {
    id: "backend",
    label: { es: "Backend y frameworks", en: "Backend and frameworks" },
    items: [
      { name: "C#", icon: "csharp" },
      { name: ".NET", icon: "dotnet" },
      { name: "Node.js", icon: "nodedotjs" },
      { name: "NestJS", icon: "nestjs" },
      { name: "Express", icon: "express" },
      { name: "TypeScript", icon: "typescript" },
      { name: "ASP.NET", icon: "dotnet" },
    ],
  },
  {
    id: "frontend",
    label: { es: "Frontend y mobile", en: "Frontend and mobile" },
    items: [
      { name: "React", icon: "react" },
      { name: "Angular", icon: "angular" },
      { name: "React Native", icon: "react" },
      { name: "Expo", icon: "expo" },
      { name: "Redux", icon: "redux" },
    ],
  },
  {
    id: "data",
    label: { es: "Datos", en: "Data" },
    items: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "SQL Server", icon: "microsoftsqlserver" },
      { name: "Oracle", icon: "oracle" },
      { name: "Power BI", icon: null },
      { name: "Azure Data Factory", icon: "azure" },
    ],
  },
  {
    id: "cloud",
    label: { es: "Cloud y DevOps", en: "Cloud and DevOps" },
    items: [
      { name: "Azure", icon: "azure" },
      { name: "Docker", icon: "docker" },
      { name: "Git", icon: "git" },
      { name: "GitHub Actions", icon: "githubactions" },
      { name: "Jenkins", icon: "jenkins" },
    ],
  },
  {
    id: "patterns",
    label: { es: "Arquitectura y patrones", en: "Architecture and patterns" },
    items: [
      { name: "Domain-Driven Design", icon: "dotnet" },
      { name: "Microservices", icon: "dotnet" },
      { name: "Event-Driven", icon: "apachekafka" },
      { name: "CQRS", icon: "dotnet" },
      { name: "N-Layer", icon: "dotnet" },
    ],
  },
  {
    id: "delivery",
    label: { es: "Cómo se entrega", en: "How it ships" },
    items: [
      { name: "Scrum", icon: "gitlab" },
      { name: "Kanban", icon: "trello" },
      { name: "Extreme Programming", icon: "dotnet" },
      { name: "SonarQube", icon: "sonarqubecloud" },
    ],
  },
];

// ----------------------------------------------------------------------------
// Credenciales
// ----------------------------------------------------------------------------

export const certifications = [
  { name: "GitHub Copilot Certification", issuer: "GitHub", date: { es: "mayo 2026", en: "May 2026" } },
  {
    name: "Scrum Foundation Professional Certification (SFPC™)",
    issuer: "CertiProf",
    date: { es: "noviembre 2023", en: "November 2023" },
  },
];

export const education = [
  {
    name: "Carrera Profesional Técnica en Software y Sistemas",
    nameEn: "Technical Career in Software and Systems",
    issuer: "Instituto SISE",
    period: { es: "ago 2016 - ene 2017", en: "Aug 2016 - Jan 2017" },
  },
];

export const languages = [
  { name: "Español", nameEn: "Spanish", level: { es: "Nativo", en: "Native" } },
  { name: "Inglés", nameEn: "English", level: { es: "B1 (Intermedio)", en: "B1 (Intermediate)" } },
];

export const courses = [
  { name: "Programming in Python", issuer: "Meta, Coursera" },
  { name: "Modern React with Redux", issuer: "Udemy" },
  { name: "Version Control", issuer: "Coursera" },
  { name: "Software Architecture Fundamentals", issuer: "Platzi" },
  { name: "Domain-Driven Design (DDD)", issuer: "Udemy" },
  { name: "Microsoft Azure Fundamentals (AZ-900)", issuer: "Udemy" },
  { name: "GitHub Actions for Beginners", issuer: "Udemy" },
  { name: "Angular", issuer: "Udemy" },
  { name: "Docker for Developers", issuer: "Udemy" },
];

// ----------------------------------------------------------------------------
// Site config
// ----------------------------------------------------------------------------

export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio.denux.tech",
  title: {
    es: "Dennis Pineda Licona, Senior Full-Stack Developer",
    en: "Dennis Pineda Licona, Senior Full-Stack Developer",
  },
  description: {
    es: "Backend developer senior con .NET y Node.js. Nueve años en banca, telecomunicaciones y energía, con un módulo de fidelización que sirvió a más de 1M de usuarios activos.",
    en: "Senior backend developer working with .NET and Node.js. Nine years across banking, telecom and energy, including a loyalty module serving 1M+ active users.",
  },
  keywords: {
    es: [
      "backend developer",
      ".NET",
      "Node.js",
      "C#",
      "microservicios",
      "Azure",
      "desarrollador backend Perú",
      "LATAM",
    ],
    en: [
      "backend developer",
      ".NET",
      "Node.js",
      "C#",
      "microservices",
      "Azure",
      "remote developer",
      "LATAM",
    ],
  },
  localePath: {
    es: "/es",
    en: "/en",
  },
} as const;

/** Dominio ASCII para hreflang: un valor con tildes rompe los parsers. */
export const asciiDomain = "portfolio.denux.tech";
