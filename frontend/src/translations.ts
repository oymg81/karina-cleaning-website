export type Language = 'en' | 'es';

export const translations = {
  en: {
    navbar: {
      home: 'Home',
      services: 'Services',
      about: 'About Us',
      reviews: 'Reviews',
      contact: 'Contact',
      quote: 'Free Estimate'
    },
    hero: {
      topRated: 'Top-Rated in Los Angeles - CA',
      title1: 'Professional',
      title2: 'Cleaning Services',
      title3: 'in California',
      subtitle: 'Clean & Care PRO provides top-quality residential and commercial cleaning services with attention to detail you can trust.',
      bookNow: 'Book Now',
      trustText: 'Licensed • Insured • Satisfaction Guaranteed',
      guaranteed: 'Guaranteed'
    },
    services: {
      subtitle: 'Our Services',
      title: 'Premium Cleaning Solutions',
      desc: 'We offer a wide range of professional cleaning services tailored to meet the unique needs of your home or business.',
      learnMore: 'Learn More',
      list: [
        {
          title: 'Residential Cleaning',
          description: 'Comprehensive cleaning for your home, ensuring a healthy and spotless living environment for your family.',
          modal: {
            intro: 'Our residential cleaning services help keep your home fresh, comfortable, and professionally cared for. Whether you need recurring cleaning, weekly service, bi-weekly service, monthly cleaning, or same-day support when scheduling allows, our team focuses on reliable results and attention to detail.',
            whatsIncludedTitle: "What's Included",
            whatsIncluded: [
              'Dusting furniture, décor, shelves, and light fixtures',
              'Cleaning countertops, sinks, and kitchen surfaces',
              'Bathroom cleaning and sanitizing',
              'Vacuuming carpets and mopping hard floors',
              'Cleaning mirrors, glass, and high-touch surfaces',
              'Emptying bins and replacing liners',
              'Making beds or changing linens when requested',
              'General tidying and home refresh'
            ],
            bestForTitle: 'Best For',
            bestFor: [
              'Single-family homes',
              'Townhomes and condos',
              'Apartments and studios',
              'Luxury homes and estates',
              'New homeowners',
              'Realtors preparing for open houses',
              'Seniors who need an extra hand'
            ]
          }
        },
        {
          title: 'Deep Cleaning',
          description: 'Intensive top-to-bottom cleaning targeting hidden dirt and grime in hard-to-reach areas of your property.',
          modal: {
            intro: 'Our deep cleaning services are designed to give your home a complete refresh with detailed attention to areas that need extra care. This service focuses on removing built-up dust, dirt, and grime from kitchens, bathrooms, floors, surfaces, and hard-to-reach spaces.',
            whatsIncludedTitle: "What's Included",
            whatsIncluded: [
              'Detailed bathroom cleaning',
              'Kitchen deep cleaning',
              'Dusting surfaces and baseboards',
              'Vacuuming and mopping floors',
              'Cleaning hard-to-reach areas',
              'Interior window cleaning',
              'Appliance exterior cleaning',
              'Removing dust and buildup',
              'Sanitizing high-touch surfaces',
              'Light organization touch-ups'
            ],
            bestForTitle: 'Best For',
            bestFor: [
              'Seasonal cleaning',
              'First-time cleaning service',
              'Special occasions',
              'Homes that need extra attention',
              'Preparing for guests or events'
            ]
          }
        },
        {
          title: 'Move In / Out Cleaning',
          description: 'Detailed cleaning to prepare your new home or leave your old space spotless for the next occupants.',
          modal: {
            intro: 'Our move-in and move-out cleaning services help prepare homes, apartments, and properties before or after a move. We carefully clean every room so the space feels fresh, spotless, and ready for the next occupant.',
            whatsIncludedTitle: "What's Included",
            whatsIncluded: [
              'Deep cleaning of all rooms and surfaces',
              'Dusting baseboards, vents, blinds, and light fixtures',
              'Scrubbing and sanitizing bathrooms and kitchens',
              'Wiping cabinets, appliances, and countertops',
              'Interior window and mirror cleaning',
              'Sweeping, vacuuming, and mopping all floors',
              'Trash removal and minor debris pickup',
              'Final walkthrough readiness'
            ],
            bestForTitle: 'Best For',
            bestFor: [
              'Tenants preparing to move out',
              'Landlords preparing for new renters',
              'Realtors staging properties',
              'Property managers',
              'New homeowners',
              'Students moving in or out',
              'Short-term rental owners between stays'
            ]
          }
        },
        {
          title: 'Office Cleaning',
          description: 'Reliable office maintenance promoting a productive and hygienic workspace for your employees.',
          modal: {
            intro: 'Our office and workspace cleaning services help maintain a clean, organized, and professional environment that supports productivity and leaves a positive impression on employees, clients, and visitors.',
            whatsIncludedTitle: "What's Included",
            whatsIncluded: [
              'Wiping desks, chairs, and office surfaces',
              'Sanitizing shared areas and electronics',
              'Cleaning windows and partitions',
              'Vacuuming carpets and mopping floors',
              'Tidying reception areas and entryways',
              'Emptying bins and removing rubbish',
              'Maintaining meeting rooms and break areas',
              'Cleaning high-touch workplace surfaces'
            ],
            bestForTitle: 'Best For',
            bestFor: [
              'Offices',
              'Workspaces',
              'Real estate offices',
              'Meeting rooms',
              'Reception areas',
              'Small business work environments'
            ]
          }
        },
        {
          title: 'Commercial Cleaning',
          description: 'Professional cleaning solutions for businesses, retail stores, and commercial facilities to impress your clients.',
          modal: {
            intro: 'Our commercial cleaning services help businesses maintain a clean, organized, and professional environment without adding stress to daily operations. Commercial cleaning is available by appointment, including Saturdays and Sundays. Evening service may be available depending on the scope and requirements of the job.',
            whatsIncludedTitle: "What's Included",
            whatsIncluded: [
              'Cleaning floors, windows, blinds, desks, and furniture',
              'Vacuuming and spot-treating carpets',
              'Bathroom and kitchen cleaning',
              'Restocking bathroom and kitchen paper products',
              'Ceiling and wall dusting',
              'Cobweb removal',
              'Emptying trash bins and managing waste disposal',
              'High-touch disinfecting services',
              'Green cleaning options when requested'
            ],
            bestForTitle: 'Businesses We Serve',
            bestFor: [
              'Office buildings',
              'Coffee shops',
              'Restaurants',
              'Gyms and fitness studios',
              'Medical offices and clinics',
              'Retail stores',
              'Art galleries',
              'Event venues',
              'Banks and churches',
              'Childcare facilities',
              'Dealerships and commercial properties'
            ]
          }
        },
        {
          title: 'Airbnb & Vacation Cleaning',
          description: 'Quick turnover cleaning services to guarantee 5-star reviews from your short-term rental guests.',
          modal: {
            intro: 'Our Airbnb and vacation cleaning services help hosts keep their properties spotless, welcoming, and guest-ready after every stay. We focus on reliable turnover cleaning, fresh presentation, and attention to detail to help support 5-star guest experiences.',
            whatsIncludedTitle: "What's Included",
            whatsIncluded: [
              'Full cleaning between guest stays',
              'Bathroom sanitizing and detailing',
              'Kitchen cleaning and surface disinfecting',
              'Bed making and linen replacement',
              'Vacuuming and mopping floors',
              'Dusting furniture and surfaces',
              'Trash removal and replacement',
              'Restocking basic guest supplies',
              'Guest-ready presentation check',
              'Flexible scheduling for check-ins and check-outs'
            ],
            bestForTitle: 'Best For',
            bestFor: [
              'Airbnb hosts',
              'Vacation rental owners',
              'Short-term rental managers',
              'Property managers',
              'Hosts managing multiple units'
            ]
          }
        }
      ]
    },
    about: {
      subtitle: 'About Us',
      title: 'Why Choose Clean & Care PRO?',
      desc: 'With years of experience serving California, we have built a reputation for excellence, reliability, and unparalleled customer service. Your satisfaction is our top priority.',
      list: [
        {
          title: 'Trusted & Experienced Team',
          description: 'Our cleaners are rigorously vetted, highly trained, and dedicated to delivering exceptional results.'
        },
        {
          title: 'City of Pomona Business Licensed • Insured',
          description: 'Clean & Care PRO is operated by Clean & Care Residential and Commercial Cleaning and carries liability insurance.'
        },
        {
          title: 'Satisfaction Guaranteed',
          description: 'We stand behind our work. If you are not completely satisfied, we will make it right.'
        },
        {
          title: 'Eco-Friendly Options',
          description: 'Eco-friendly product options may be available depending on the service. During your estimate, let us know about allergies, product or brand preferences, and any pets in the property so we can discuss suitable options.'
        }
      ]
    },
    schedule: {
      subtitle: 'FLEXIBLE SCHEDULES',
      title: '🏢 Cleaning That Fits Your Business Hours',
      desc: 'Commercial cleaning is available by appointment, including Saturdays and Sundays. Evening service may be available depending on the scope and requirements of the job.',
      residentialTitle: 'Residential Cleaning',
      residentialDays: 'Monday – Friday',
      residentialHours: '8:00 AM – 6:00 PM',
      commercialTitle: 'Commercial Cleaning',
      commercialHours: 'By Appointment (Evenings Subject to Evaluation)',
      weekendTitle: 'Weekend Service',
      weekendHours: 'Saturdays & Sundays by Appointment',
      customPlans: 'Customized cleaning plans available for offices, businesses, and commercial spaces.'
    },
    reviews: {
      subtitle: 'Testimonials',
      title: 'What Our Clients Say',
      ratingText: 'Average rating based on hundreds of reviews.',
      leaveReview: 'Leave a Review',
      list: [
        {
          name: 'Sarah Johnson',
          location: 'Irvine, CA',
          date: '2 weeks ago',
          text: 'Clean & Care PRO did an amazing job with our move-out clean. The apartment looked better than when we first moved in! Highly professional and punctual team.'
        },
        {
          name: 'Michael Chen',
          location: 'Newport Beach, CA',
          date: '1 month ago',
          text: 'We use their commercial cleaning services for our office building. They are incredibly reliable, detail-oriented, and easy to communicate with. 5 stars all the way.'
        },
        {
          name: 'Jessica Williams',
          location: 'Anaheim, CA',
          date: '2 months ago',
          text: 'I hired them for a deep clean before hosting family for the holidays. The team was fantastic, and the attention to detail was exactly what I was looking for.'
        }
      ]
    },
    cta: {
      title1: 'Ready for a',
      title2: 'Cleaner Space?',
      desc: 'Book your cleaning service today and enjoy a clean, healthy and beautiful environment.',
      call: 'Call',
      fastQuotes: 'Fast & Free Quotes',
      flexible: 'Flexible Scheduling',
      formTitle: 'Request a Free Quote',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      serviceType: 'Service Type',
      message: 'Message (Optional)',
      messagePlaceholder: 'Tell us about your space and specific needs...',
      sendRequest: 'Send Request',
      successMessage: 'Thank you! Your request has been submitted. We will contact you shortly.'
    },
    footer: {
      desc: 'Providing top-quality residential and commercial cleaning services across California. We care about your space as much as you do.',
      quickLinks: 'Quick Links',
      services: 'Services',
      locations: 'Locations',
      locationsList: [
        'Orange County',
        'Glendale and surrounding areas',
        'Rosemead and surrounding areas',
        'Los Angeles',
        'Upland',
        'Fontana',
        'Corona'
      ],
      seeAllLocations: 'See All Locations',
      contactInfo: 'Contact Info',
      serving: 'Serving Orange County, Glendale, Rosemead, Los Angeles, Upland, Fontana, and Corona',
      rights: 'Clean & Care PRO. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      developedBy: 'Designed & Developed by',
      callUsNow: 'CALL US NOW',
      sendUsEmail: 'SEND US AN EMAIL',
      messageUsWhatsApp: 'MESSAGE US ON WHATSAPP',
      servingAreas: 'Orange County, Glendale, Rosemead, Los Angeles, Upland, Fontana, Corona',
      coverageNotice: 'We proudly serve Orange County, Glendale and surrounding areas, Rosemead and surrounding areas, Los Angeles, Upland, Fontana, and Corona. Contact us to confirm availability for your location.',
      legalNotice: 'Clean & Care PRO is operated by Clean & Care Residential and Commercial Cleaning.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      designedBy: 'Designed & Developed by',
      cta: {
        call: 'Call 714-473-1140',
        whatsapp: 'WhatsApp',
        email: 'Send Email'
      }
    }
  },
  es: {
    navbar: {
      home: 'Inicio',
      services: 'Servicios',
      about: 'Nosotros',
      reviews: 'Reseñas',
      contact: 'Contacto',
      quote: 'Estimado Gratis'
    },
    hero: {
      topRated: 'Mejor Calificados en Los Angeles - CA',
      title1: 'Servicios de',
      title2: 'Limpieza Profesional',
      title3: 'en California',
      subtitle: 'Clean & Care PRO ofrece servicios de limpieza residencial y comercial de alta calidad con atención al detalle en la que puede confiar.',
      bookNow: 'Reservar Ahora',
      trustText: 'Licenciados • Asegurados • Satisfacción Garantizada',
      guaranteed: 'Garantizado'
    },
    services: {
      subtitle: 'Nuestros Servicios',
      title: 'Soluciones de Limpieza Premium',
      desc: 'Ofrecemos una amplia gama de servicios de limpieza profesional adaptados a las necesidades únicas de su hogar o negocio.',
      learnMore: 'Más Información',
      list: [
        {
          title: 'Limpieza Residencial',
          description: 'Limpieza integral para su hogar, asegurando un ambiente de vida saludable e impecable para su familia.',
          modal: {
            intro: 'Nuestros servicios de limpieza residencial ayudan a mantener tu hogar fresco, cómodo y cuidado profesionalmente. Ya sea que necesites limpieza recurrente, semanal, quincenal, mensual o servicio el mismo día cuando haya disponibilidad, nuestro equipo se enfoca en resultados confiables y atención al detalle.',
            whatsIncludedTitle: 'Qué incluye',
            whatsIncluded: [
              'Limpieza de muebles, decoración, repisas y lámparas',
              'Limpieza de superficies, lavamanos y áreas de cocina',
              'Limpieza y desinfección de baños',
              'Aspirado de alfombras y trapeado de pisos',
              'Limpieza de espejos, vidrios y superficies de alto contacto',
              'Retiro de basura y reemplazo de bolsas',
              'Tendido de camas o cambio de sábanas cuando se solicite',
              'Orden general y refrescado del hogar'
            ],
            bestForTitle: 'Ideal para',
            bestFor: [
              'Casas familiares',
              'Townhomes y condominios',
              'Apartamentos y estudios',
              'Casas de lujo',
              'Nuevos propietarios',
              'Realtors preparando open houses',
              'Personas mayores que necesitan apoyo adicional'
            ]
          }
        },
        {
          title: 'Limpieza Profunda',
          description: 'Limpieza intensiva de arriba a abajo enfocada en la suciedad oculta en áreas de difícil acceso de su propiedad.',
          modal: {
            intro: 'Nuestros servicios de limpieza profunda están diseñados para darle a tu hogar una renovación completa con atención detallada en las áreas que necesitan mayor cuidado. Este servicio se enfoca en remover polvo acumulado, suciedad y residuos en cocinas, baños, pisos, superficies y espacios difíciles de alcanzar.',
            whatsIncludedTitle: 'Qué incluye',
            whatsIncluded: [
              'Limpieza detallada de baños',
              'Limpieza profunda de cocina',
              'Limpieza de superficies y zócalos',
              'Aspirado y trapeado de pisos',
              'Limpieza de áreas difíciles de alcanzar',
              'Limpieza interior de ventanas',
              'Limpieza exterior de electrodomésticos',
              'Remoción de polvo y acumulación',
              'Desinfección de superficies de alto contacto',
              'Organización ligera cuando sea necesario'
            ],
            bestForTitle: 'Ideal para',
            bestFor: [
              'Limpieza de temporada',
              'Primera limpieza con el servicio',
              'Ocasiones especiales',
              'Hogares que necesitan atención extra',
              'Preparación para invitados o eventos'
            ]
          }
        },
        {
          title: 'Limpieza de Mudanza',
          description: 'Limpieza detallada para preparar su nuevo hogar o dejar su antiguo espacio impecable para los próximos ocupantes.',
          modal: {
            intro: 'Nuestros servicios de limpieza para mudanza ayudan a preparar casas, apartamentos y propiedades antes o después de una mudanza. Limpiamos cada habitación cuidadosamente para que el espacio quede fresco, impecable y listo para el próximo ocupante.',
            whatsIncludedTitle: 'Qué incluye',
            whatsIncluded: [
              'Limpieza profunda de habitaciones y superficies',
              'Limpieza de zócalos, ventilas, persianas y lámparas',
              'Limpieza y desinfección de baños y cocinas',
              'Limpieza de gabinetes, electrodomésticos y encimeras',
              'Limpieza interior de ventanas y espejos',
              'Barrido, aspirado y trapeado de pisos',
              'Retiro de basura y residuos menores',
              'Preparación final para inspección o entrega'
            ],
            bestForTitle: 'Ideal para',
            bestFor: [
              'Inquilinos que se están mudando',
              'Dueños preparando la propiedad para nuevos inquilinos',
              'Realtors preparando propiedades',
              'Administradores de propiedades',
              'Nuevos propietarios',
              'Estudiantes que se mudan',
              'Dueños de alquileres temporales entre estadías'
            ]
          }
        },
        {
          title: 'Limpieza de Oficina',
          description: 'Mantenimiento de oficina confiable que promueve un espacio de trabajo productivo e higiénico para sus empleados.',
          modal: {
            intro: 'Nuestros servicios de limpieza de oficinas y espacios de trabajo ayudan a mantener un ambiente limpio, organizado y profesional que apoya la productividad y deja una buena impresión en empleados, clientes y visitantes.',
            whatsIncludedTitle: 'Qué incluye',
            whatsIncluded: [
              'Limpieza de escritorios, sillas y superficies de oficina',
              'Desinfección de áreas compartidas y electrónicos',
              'Limpieza de ventanas y divisiones',
              'Aspirado de alfombras y trapeado de pisos',
              'Orden de recepción y entradas',
              'Retiro de basura',
              'Mantenimiento de salas de reuniones y áreas de descanso',
              'Limpieza de superficies de alto contacto'
            ],
            bestForTitle: 'Ideal para',
            bestFor: [
              'Oficinas',
              'Espacios de trabajo',
              'Oficinas de bienes raíces',
              'Salas de reuniones',
              'Áreas de recepción',
              'Pequeños negocios'
            ]
          }
        },
        {
          title: 'Limpieza Comercial',
          description: 'Soluciones de limpieza profesional para empresas, tiendas minoristas y locales comerciales para impresionar a sus clientes.',
          modal: {
            intro: 'Nuestros servicios de limpieza comercial ayudan a los negocios a mantener un ambiente limpio, organizado y profesional sin agregar estrés a sus operaciones diarias. La limpieza comercial está disponible con cita previa, incluidos sábados y domingos. El servicio nocturno puede estar disponible según el alcance y los requisitos del trabajo.',
            whatsIncludedTitle: 'Qué incluye',
            whatsIncluded: [
              'Limpieza de pisos, ventanas, persianas, escritorios y muebles',
              'Aspirado y tratamiento puntual de alfombras',
              'Limpieza de baños y cocinas',
              'Reposición de productos de papel en baños y cocinas',
              'Limpieza de techos y paredes',
              'Remoción de telarañas',
              'Retiro de basura y manejo de residuos',
              'Desinfección de superficies de alto contacto',
              'Opciones de limpieza ecológica cuando se solicite'
            ],
            bestForTitle: 'Negocios que atendemos',
            bestFor: [
              'Edificios de oficinas',
              'Cafeterías',
              'Restaurantes',
              'Gimnasios y estudios fitness',
              'Oficinas médicas y clínicas',
              'Tiendas minoristas',
              'Galerías de arte',
              'Locales para eventos',
              'Bancos e iglesias',
              'Guarderías',
              'Dealerships y propiedades comerciales'
            ]
          }
        },
        {
          title: 'Limpieza para Airbnb y Alquileres Vacacionales',
          description: 'Servicios de limpieza rápidos para garantizar reseñas de 5 estrellas de sus huéspedes de alquiler a corto plazo.',
          modal: {
            intro: 'Nuestros servicios de limpieza para Airbnb y alquileres vacacionales ayudan a los anfitriones a mantener sus propiedades impecables, acogedoras y listas para cada huésped. Nos enfocamos en limpieza entre estadías, presentación fresca y atención al detalle para apoyar experiencias de 5 estrellas.',
            whatsIncludedTitle: 'Qué incluye',
            whatsIncluded: [
              'Limpieza completa entre estadías',
              'Limpieza y desinfección de baños',
              'Limpieza de cocina y desinfección de superficies',
              'Tendido de camas y reemplazo de ropa de cama',
              'Aspirado y trapeado de pisos',
              'Limpieza de muebles y superficies',
              'Retiro y reemplazo de basura',
              'Reposición de suministros básicos para huéspedes',
              'Revisión de presentación lista para huéspedes',
              'Horarios flexibles para check-ins y check-outs'
            ],
            bestForTitle: 'Ideal para',
            bestFor: [
              'Anfitriones de Airbnb',
              'Dueños de alquileres vacacionales',
              'Administradores de alquileres temporales',
              'Administradores de propiedades',
              'Anfitriones con múltiples unidades'
            ]
          }
        }
      ]
    },
    about: {
      subtitle: 'Sobre Nosotros',
      title: '¿Por qué elegir Clean & Care PRO?',
      desc: 'Con años de experiencia sirviendo en California, hemos construido una reputación de excelencia, confiabilidad y servicio al cliente incomparable. Su satisfacción es nuestra prioridad.',
      list: [
        {
          title: 'Equipo de Confianza y Experiencia',
          description: 'Nuestros limpiadores son rigurosamente evaluados, altamente capacitados y dedicados a ofrecer resultados excepcionales.'
        },
        {
          title: 'Licencia comercial de la Ciudad de Pomona • Asegurada',
          description: 'Clean & Care PRO es operada por Clean & Care Residential and Commercial Cleaning y cuenta con seguro de responsabilidad civil.'
        },
        {
          title: 'Satisfacción Garantizada',
          description: 'Respaldamos nuestro trabajo. Si no está completamente satisfecho, lo solucionaremos.'
        },
        {
          title: 'Opciones de Productos Ecológicos',
          description: 'Podemos conversar sobre opciones de productos ecológicos según el servicio. Durante el estimado, infórmanos sobre alergias, preferencias de productos o marcas y mascotas en la propiedad para evaluar las opciones apropiadas.'
        }
      ]
    },
    schedule: {
      subtitle: 'HORARIOS FLEXIBLES',
      title: '🏢 Limpieza Que Se Adapta al Horario de Tu Negocio',
      desc: 'La limpieza comercial está disponible con cita previa, incluidos sábados y domingos. El servicio nocturno puede estar disponible según el alcance y los requisitos del trabajo.',
      residentialTitle: 'Limpieza Residencial',
      residentialDays: 'Lunes – Viernes',
      residentialHours: '8:00 AM – 6:00 PM',
      commercialTitle: 'Limpieza Comercial',
      commercialHours: 'Con cita previa (tardes/noches según evaluación)',
      weekendTitle: 'Servicio de Fin de Semana',
      weekendHours: 'Sábados y domingos con cita previa',
      customPlans: 'Planes de limpieza personalizados disponibles para oficinas, negocios y espacios comerciales.'
    },
    reviews: {
      subtitle: 'Testimonios',
      title: 'Lo Que Dicen Nuestros Clientes',
      ratingText: 'Calificación promedio basada en cientos de reseñas.',
      leaveReview: 'Dejar una Reseña',
      list: [
        {
          name: 'Sarah Johnson',
          location: 'Irvine, CA',
          date: 'Hace 2 semanas',
          text: 'Clean & Care PRO hizo un trabajo increíble con nuestra limpieza de mudanza. ¡El apartamento se veía mejor que cuando nos mudamos! Un equipo muy profesional y puntual.'
        },
        {
          name: 'Michael Chen',
          location: 'Newport Beach, CA',
          date: 'Hace 1 mes',
          text: 'Usamos sus servicios de limpieza comercial para nuestro edificio de oficinas. Son increíblemente confiables, detallistas y fáciles de comunicar. 5 estrellas sin duda.'
        },
        {
          name: 'Jessica Williams',
          location: 'Anaheim, CA',
          date: 'Hace 2 meses',
          text: 'Los contraté para una limpieza profunda antes de recibir a mi familia en las vacaciones. El equipo fue fantástico y la atención al detalle era exactamente lo que buscaba.'
        }
      ]
    },
    cta: {
      title1: '¿Listo para un',
      title2: 'Espacio más Limpio?',
      desc: 'Reserve su servicio de limpieza hoy y disfrute de un ambiente limpio, saludable y hermoso.',
      call: 'Llamar al',
      fastQuotes: 'Cotizaciones Rápidas y Gratuitas',
      flexible: 'Horarios Flexibles',
      formTitle: 'Solicite una Cotización Gratis',
      fullName: 'Nombre Completo',
      email: 'Correo Electrónico',
      phone: 'Número de Teléfono',
      serviceType: 'Tipo de Servicio',
      message: 'Mensaje (Opcional)',
      messagePlaceholder: 'Cuéntenos sobre su espacio y necesidades específicas...',
      sendRequest: 'Enviar Solicitud',
      successMessage: '¡Gracias! Su solicitud ha sido enviada. Nos pondremos en contacto con usted a la brevedad.'
    },
    footer: {
      desc: 'Ofreciendo servicios de limpieza residencial y comercial de alta calidad en toda California. Nos preocupamos por su espacio tanto como usted.',
      quickLinks: 'Enlaces Rápidos',
      services: 'Servicios',
      locations: 'Ubicaciones',
      locationsList: [
        'Orange County',
        'Glendale y áreas cercanas',
        'Rosemead y áreas cercanas',
        'Los Angeles',
        'Upland',
        'Fontana',
        'Corona'
      ],
      seeAllLocations: 'Ver Todas las Ubicaciones',
      contactInfo: 'Información de Contacto',
      serving: 'Atendemos Orange County, Glendale, Rosemead, Los Angeles, Upland, Fontana y Corona',
      rights: 'Clean & Care PRO. Todos los derechos reservados.',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
      developedBy: 'Diseñado y desarrollado por',
      callUsNow: 'LLÁMENOS AHORA',
      sendUsEmail: 'ENVÍENOS UN EMAIL',
      messageUsWhatsApp: 'ENVÍENOS UN WHATSAPP',
      servingAreas: 'Orange County, Glendale, Rosemead, Los Angeles, Upland, Fontana, Corona',
      coverageNotice: 'Atendemos Orange County, Glendale y áreas cercanas, Rosemead y áreas cercanas, Los Angeles, Upland, Fontana y Corona. Contáctanos para confirmar la disponibilidad en tu ubicación.',
      legalNotice: 'Clean & Care PRO es operada por Clean & Care Residential and Commercial Cleaning.',
      privacyPolicy: 'Política de Privacidad',
      termsOfService: 'Términos de Servicio',
      designedBy: 'Diseñado y desarrollado por',
      cta: {
        call: 'Llamar 714-473-1140',
        whatsapp: 'WhatsApp',
        email: 'Enviar Email'
      }
    }
  }
};

