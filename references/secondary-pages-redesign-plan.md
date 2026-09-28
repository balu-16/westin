# About, Programs and Campus life redesign

## Goal and boundary

Bring the three main navigation destinations into the Home page's visual family: warm ivory and light beige surfaces, deep navy type, restrained burnt orange accents, editorial serif headings, real photographs, and generous space. Keep the next full redesign phase for Placements, Admissions and Contact. The company logo marquee and placement figure highlights belong to that later Placements phase.

## Shared design system

| Element | Treatment | Purpose |
| --- | --- | --- |
| Page surface | `#fbfaf7` with alternating `#f3f0ea` panels | Continuity with Home without making every section identical |
| Type | Georgia editorial headings, clear sans serif body, navy `#0d2e51` | Match Home and improve hierarchy |
| Accent | Burnt orange `#c14e13` for actions and small rules | Reserve high contrast for the next action |
| Hero | Split copy and locally stored official Westin photograph | Replace the decorative sketch with a relevant visual |
| Content | Responsive asymmetric bento cards, photo cards, short links | Turn numbered rows into scannable groups |
| Interaction | Hover lift, image zoom and pointer glow on capable devices | Add feedback without making content depend on motion |
| Accessibility | Keyboard visible focus, semantic links, useful alt text, pause control and reduced motion rules | Keep the visual system usable across devices |

## Page composition

### About `/about`

1. Photographic opening with the official hospitality conversation image and a direct route to the college story.
2. Bento cards for the college's Vijayawada story, purpose, founder and leadership, recognition, historic figures, and faculty. Keep sources with the claims; label historic numbers as such.
3. People and purpose navigation leading to mission and vision, management, faculty and Why Westin.
4. Preserve the longer sourced college profile and founder message in an accessible expandable section below the overview so the landing page reads quickly.

### Programs `/programs`

1. Photographic opening with official hands on training imagery.
2. Three visually distinct study paths: Business, Hospitality, and Junior College. Each group uses mixed size course cards and a real photo, with direct links to every existing course detail route.
3. Use duration, focus and outcomes as short supporting facts. Keep entry requirements on the individual course page, where they can be read in context.
4. Keep the smaller options from the published course guide in a separate note and retain the original campaign material in an expandable section.

### Campus life `/campus`

1. Photographic opening with the official campus culture image.
2. Bento cards for study spaces, practice, activities, and student communities, with official photographs integrated into the larger cards.
3. A photo led invitation to explore infrastructure, events, and the official gallery.
4. Keep the longer campus and student life material available in an expandable section below the visual overview.

## Next phase

After the three redesigned pages are reviewed, update Placements with a logo marquee and prominent 42 LPA, 8 LPA and 100% figures with their published context. Redesign Admissions and Contact in that phase as well.

## Verification

- Review the three routes at desktop and mobile widths, including 320 px.
- Check that hero photographs load, bento cards do not overflow, and course links and source links work.
- Run the public page Playwright checks, automated accessibility checks, and the production build/prerender verifier.
