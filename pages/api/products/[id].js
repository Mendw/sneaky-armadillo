const products = [
  {
    "series": "AOT",
    "volume": 1,
    "language": "ES",
    "name": "Ataque a los Titanes",
    "image": "xitK8lYd.jpeg",
    "price": 20.0,
    "category": "Manga",
    "description": ["La raza humana, antaño dueña del mundo, se enfrenta a la extinción a manos de los titanes, gigantescos monstruos de inteligencia limitada que cazan y devoran personas por diversión. Los supervivientes se hacinan e intentan sobrevivir en una pequeña ciudad… pero algunos ya están hartos: ¡van a atacar!"]
  },
  {
    "series": "JJK",
    "volume": 1,
    "language": "ES",
    "name": "Jujutsu Kaisen",
    "image": "Tixp3OWR.jpeg",
    "price": 20.0,
    "category": "Accesorios",
    "description":["Yûji Itadori es un estudiante con unas habilidades físicas excepcionales. Todos los días, como rutina, va al hospital a visitar a su abuelo enfermo y decide apuntarse al club de ocultismo del instituto para no dar un palo al agua... Sin embargo, un buen día el sello del talismán que se hallaba escondido en su instituto se rompe, y comienzan a aparecer unos monstruos. Ante este giro de los acontecimientos, Itadori decide adentrarse en el instituto para salvar a sus compañeros. ¿Qué le deparará el destino?"]
  },
  {
    "series": "KNY",
    "volume": 1,
    "language": "ES",
    "name": "Guardianes de la Noche",
    "image": "Ht3Y7YTh.jpeg",
    "price": 20.99,
    "category": "Manga",
    "description": ["Tanjirou Kamado es un chico alegre y trabajador que vive felizmente junto a su familia, hasta que un fatídico día un demonio llamado Muzan irrumpe en su vida matando a sus padres y maldice a su hermana pequeña convirtiéndola en demonio. Tras este incidente, y con el propósito de vengar a sus padres y devolver a su hermana Nezuko a la normalidad, decide convertirse en un asesino de demonios. Para ello, acude en ayuda de Sakonji Urokodaki, uno de los asesinos de demonios más fuertes del mundo...", "Entre samuráis, afiladas katanas, demonios y otros seres mitológicos del folclore japonés, este manga es una apuesta segura para los amantes del género."]
  }
]

function productID(product) {
  return product.volume ? `${product.series}-${`${product.volume}`.padStart(3, '0')}${product.language}` : `${product.series}-${product.language}`;
}

export default function handler(req, res) {
  let { id } = req.query

  for(let i = 0; i < products.length; i++) {
    if(productID(products[i]) === id) {
      res.json({
        ...products[i]
      }); return
    }
  }

  res.json({
    error: 'not found'
  })
}