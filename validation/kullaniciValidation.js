// utils/validate.js
const Joi = require('joi');

// Joi validation şeması (kullaniciValidationSchema)
const kullaniciValidationSchema = Joi.object({
  ad: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'Ad alanı metin türünde olmalıdır.',
      'string.empty': 'Ad alanı boş bırakılamaz.',
      'string.min': 'Ad alanı en az {#limit} karakter uzunluğunda olmalıdır.',
      'string.max': 'Ad alanı en fazla {#limit} karakter uzunluğunda olmalıdır.',
      'any.required': 'Ad alanı zorunludur.'
    }),

  soyad: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'Soyad alanı metin türünde olmalıdır.',
      'string.empty': 'Soyad alanı boş bırakılamaz.',
      'string.min': 'Soyad alanı en az {#limit} karakter uzunluğunda olmalıdır.',
      'string.max': 'Soyad alanı en fazla {#limit} karakter uzunluğunda olmalıdır.',
      'any.required': 'Soyad alanı zorunludur.'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'E-posta alanı metin türünde olmalıdır.',
      'string.empty': 'E-posta alanı boş bırakılamaz.',
      'string.email': 'Geçerli bir e-posta adresi giriniz.',
      'any.required': 'E-posta alanı zorunludur.'
    }),

  sifre: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.base': 'Şifre alanı metin türünde olmalıdır.',
      'string.empty': 'Şifre alanı boş bırakılamaz.',
      'string.min': 'Şifre alanı en az {#limit} karakter uzunluğunda olmalıdır.',
      'any.required': 'Şifre alanı zorunludur.'
    }),

  rol: Joi.string()
    .valid('standart', 'admin', 'yonetici')
    .optional()
    .messages({
      'string.base': 'Rol alanı metin türünde olmalıdır.',
      'any.only': 'Rol alanı şu değerlerden birini almalıdır: {#values}'
    }),
});

// Validation middleware fonksiyonu
const validateKullanici = (req, res, next) => {
  const { error } = kullaniciValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next(); // Eğer validasyon geçerse, bir sonraki middleware'e geçer.
};

module.exports = { validateKullanici };