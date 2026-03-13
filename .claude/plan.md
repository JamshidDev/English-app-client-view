# HomePage Module Grid Redesign

## O'zgarishlar

### 1. ModuleCard.vue — SVG iconlar + yaxshilangan dizayn
- Emoji (📖, 📝, 🎧, 🗣️) o'rniga inline SVG Heroicons ishlatish
- Active card: gradient fon + oq SVG icon (hozirgi kabi, lekin icon tozaroq)
- Inactive card: gray fon + "Coming Soon" badge (hozirgi kabi)
- Icon uchun rounded bg container qo'shish

### 2. `src/data/modules.ts` — icon fieldni yangilash
- `icon: '📖'` -> `icon: 'vocabulary'` (id sifatida, SVG komponentda render bo'ladi)
- Yoki icon fieldni olib tashlab, id bo'yicha SVG tanlash

### 3. SVG Iconlar (inline, kutubxona kerak emas)
- Vocabulary: book-open icon
- Grammar: pencil-square / document-text icon
- Listening: headphones / musical-note icon
- Speaking: microphone icon

## Fayllari
- `src/components/common/ModuleCard.vue` — dizayn + SVG icon
- `src/data/modules.ts` — icon field yangilash
- `src/types/module.ts` — kerak bo'lsa type yangilash
