import express from 'express'
import multer from 'multer'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/webp', 'image/jpeg']
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Tipo de arquivo não permitido. Aceitamos PNG, WEBP e JPEG.'))
    }
    cb(null, true)
  }
})

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' })
    }

    let image = sharp(req.file.buffer)
    const metadata = await image.metadata()

    const maxDimension = 1080
    let { width, height } = metadata
    if (width > maxDimension || height > maxDimension) {
      const ratio = Math.min(maxDimension / width, maxDimension / height)
      width = Math.round(width * ratio)
      height = Math.round(height * ratio)
      image = image.resize(width, height)
    }

    const filename = `image_${Date.now()}_${Math.round(Math.random() * 1000)}${path.extname(
      req.file.originalname
    )}`
    const uploadDir = path.join(process.cwd(), 'uploads')

    fs.mkdirSync(uploadDir, { recursive: true })
    const filepath = path.join(uploadDir, filename)

    await image.toFile(filepath)

    const imageUrl = `http://localhost:3030/uploads/${filename}`
    res.json({ url: imageUrl })
  } catch (err) {
    console.error('Erro ao processar upload:', err)
    res.status(500).json({ error: 'Erro ao processar a imagem.' })
  }
})

export default router
