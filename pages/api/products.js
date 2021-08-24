import { getRange } from '../../lib/sheets'

getRange()

export default function handler(req, res) {
  res.status(200).json([
    {
      "series": "AOT",
      "volume": 1,
      "language": "ES",
      "name": "Ataque a los Titanes",
      "image": "xitK8lYd.jpeg",
      "price": 20.0,
      "category": "Manga"
    },
    {
      "series": "JJK",
      "volume": 1,
      "language": "ES",
      "name": "Jujutsu Kaisen",
      "image": "Tixp3OWR.jpeg",
      "price": 20.0,
      "category": "Accesorios"
    },
    {
      "series": "KNY",
      "volume": 1,
      "language": "ES",
      "name": "Guardianes de la Noche",
      "image": "Ht3Y7YTh.jpeg",
      "price": 20.99,
      "category": "Manga"
    },
    {
      "series": "JJK",
      "volume": 1,
      "language": "ES",
      "name": "Jujutsu Kaisen",
      "image": "Tixp3OWR.jpeg",
      "price": 20.0,
      "category": "Accesorios"
    },
    {
      "series": "AOT",
      "volume": 1,
      "language": "ES",
      "name": "Ataque a los Titanes",
      "image": "xitK8lYd.jpeg",
      "price": 20.0,
      "category": "Manga"
    },
    {
      "series": "KNY",
      "volume": 1,
      "language": "ES",
      "name": "Guardianes de la Noche",
      "image": "Ht3Y7YTh.jpeg",
      "price": 20.99,
      "category": "Manga"
    },
  ])
}
