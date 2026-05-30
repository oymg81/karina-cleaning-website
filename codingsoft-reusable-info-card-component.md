# Reusable Info Card Component Documentation

This document defines the specification and implementation standards for CodingSoft's premium **Reusable Info Card Component**. 
Based on the approved visual assets of the Clean & Care PRO website, this component delivers a polished, modern, soft-chrome design optimized for clean presentation, balanced contrast, and responsive layout scaling.

---

## 1. Component Purpose
The Reusable Info Card is designed to communicate structured details in a digestible layout. It is highly versatile and serves as a content delivery tool for:
- Service catalog cards
- Feature/benefits grids
- Scheduling and business hours
- Procedural step-by-step guides
- Highlight lists

---

## 2. Visual Design Description
The card utilizes a **soft-chrome/silver visual style** that feels metallic, modern, and premium without looking heavy or futuristic.

Key design attributes include:
- **Depth**: Created using a smooth, diagonal gradient transitioning from a bright, clean, off-white/silver to a solid chrome-silver tone.
- **Form**: Large, soft-rounded corners providing a friendly yet professional outline.
- **Accents**: High-contrast outline border using a semi-transparent opacity to give a glass/brushed metal border reflection.
- **Shadow**: Generous, soft drop-shadow using a dark slate/navy tint to make the card feel like it is floating off the page.

---

## 3. Reusable Card Anatomy
Each card consists of the following structured vertical layout:
```
+-------------------------------------------------+
|  [Icon Container]                               | (Circle/Square with Blue Accent)
|                                                 |
|  [Title / Heading]                              | (Bold Navy/Slate, high readability)
|                                                 |
|  [Supporting Text / Description]                | (Concise, dark gray font)
|                                                 |
|  [Optional Emphasis Line]                       | (Highlighted subtitle or text)
|                                                 |
|  [Optional CTA / Action Button]                 | (Learn More link or button)
+-------------------------------------------------+
```

---

## 4. Styling Tokens

The visual style is built using the following design tokens:

### Colors & Gradients
| Token Name | Token Type | Value / Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| `color-silver-light` | Hex Color | `#F4F6F8` | Gradient start color (top-left) |
| `color-chrome-base` | Hex Color | `#B6BBC2` | Gradient end color (bottom-right) |
| `color-border-chrome` | RGBA Color | `rgba(182, 187, 194, 0.55)` | Subtle cool-gray card border |
| `color-shadow-base` | RGBA Color | `rgba(15, 23, 42, 0.10)` | Card drop shadow |
| `color-shadow-hover`| RGBA Color | `rgba(15, 23, 42, 0.14)` | Elevated card drop shadow on hover |
| `color-icon-bg` | Tailwind/Hex | `bg-blue-100` | Backdrop of the icon container |
| `color-icon-accent` | Tailwind/Hex | `text-blue-600` | Color of the graphic icon |
| `color-text-title` | Hex / Palette | Navy / `#0F172A` | Core title text color |
| `color-text-body` | Hex / Palette | Slate-600 / `#475569` | Supporting descriptive text |

---

## 5. Typography Rules
To maintain visual balance and excellent readability over the chrome gradient:
- **Title**: Large, bold, or extra-bold sans-serif (`font-sans font-bold text-xl`). Uses deep dark colors (`text-navy` / `text-slate-900`) for high contrast against the silver backdrop.
- **Supporting Text**: Medium or regular weight (`font-normal text-sm` or `text-base`). Uses slate/gray (`text-slate-600` or `text-slate-700`) to maintain a clear visual hierarchy.
- **Emphasis Text**: Strong font-weight (`font-bold text-sm`). Uses brand highlight color (e.g. `text-blue-600` or `text-green-600`) to draw immediate focus.
- **CTA Text**: Semi-bold or bold (`font-semibold text-sm`). Color should match brand primary accent.

---

## 6. Spacing Rules
The card relies on clean, generous whitespace to keep elements separated:
- **Inner Padding**: `p-8` (2rem / 32px) on all sides. For smaller viewports (mobile), it scales down slightly to `p-6` (1.5rem / 24px) if needed, though `p-8` is preferred for breathing room.
- **Icon Margin**: `mb-6` (1.5rem / 24px) below the icon block.
- **Title Margin**: `mb-3` or `mb-4` (0.75rem to 1rem) below the title.
- **Description Margin**: `mb-6` (1.5rem / 24px) below the description to separate it from the footer links or CTAs.
- **Flex Layout**: Uses `flex flex-col h-full` to align the CTA button strictly at the bottom (`mt-auto`).

---

## 7. Icon Rules
Icons provide a visual cue for each service or hour slot:
- **Container Shape**: Rounded circle (`rounded-full`) or rounded square (`rounded-xl` / `rounded-2xl`).
- **Container Size**: `w-14 h-14` (3.5rem / 56px) offering consistent footprint.
- **Icon Size**: `w-7 h-7` (1.75rem / 28px) centered inside the container.
- **Color Theme**: Accent background (`bg-blue-100` / `bg-blue-50`) paired with a vivid primary icon color (`text-blue-600`).

---

## 8. Content Guidelines
- **Keep Titles Concise**: Limit titles to 2–4 words (e.g. "Residential Cleaning", "Office Cleaning").
- **Concise Descriptions**: Limit the text block to 12–18 words. Avoid wrapping more than 3 lines of description on desktop layout.
- **Direct Tone**: Focus on the core benefit or service coverage. Detailed lists should be offloaded to a popup modal or dedicated landing page rather than cluttering the card face.

---

## 9. Hover/Interaction Guidelines
Micro-interactions are critical to making the card feel alive and premium:
- **Transition**: Uses `transition-all duration-300` for all styles.
- **Translation / Lift**: On hover, the card shifts upwards by `4px` (`hover:-translate-y-1` or `hover:-translate-y-[4px]`) to give physical feedback.
- **Shadow Enhancement**: The shadow broadens and deepens on hover (`hover:shadow-[0_18_36px_rgba(15,23,42,0.14)]`) to emphasize the separation from the page surface.

---

## 10. Responsive Behavior
- **Grid Layout**: Always place cards inside a responsive grid (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`).
- **Aspect Ratio**: Keep cards flex-column (`flex flex-col h-full`). This guarantees cards in the same row maintain identical height regardless of description word counts.
- **Centering**: For business hours or simple layouts, center elements (`items-center text-center`). For feature catalog displays, left-align elements (`items-start text-left`) to maintain readability.

---

## 11. Accessibility Notes
- **Contrast Check**: Ensure text contrast over the `#B6BBC2` silver background satisfies WCAG AA guidelines (at least 4.5:1 ratio). Titles (`text-slate-900`) and body copy (`text-slate-700`) must remain dark.
- **Semantic Tags**: Card titles should use heading elements (`<h4>` or `<h3>`) maintaining proper page nesting.
- **Focus Ring**: If the card itself is clickable, apply an outline focus state: `focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-4`.
- **Screen Readers**: If utilizing a clickable "Learn More" link, ensure the screen reader reads the target context (e.g., `aria-label="Learn more about Residential Cleaning"`).

---

## 12. Example Use Cases

### 1. Service List Card
- **Icon**: Home outline
- **Title**: Residential Cleaning
- **Description**: Comprehensive cleaning for your home, ensuring a healthy and spotless living environment for your family.
- **CTA**: "Learn More" link with arrow icon.

### 2. Business Hours Card
- **Icon**: Clock icon
- **Title**: Commercial Cleaning
- **Description**: Available in the evenings and overnight to minimize operating interruptions.
- **Emphasis**: "Evenings & Overnight Available" highlighted text.

---

## 13. React & Tailwind Implementation Example

Below is the complete React functional component implementing this specification in TypeScript with Tailwind CSS:

```tsx
import React from 'react';
import * as LucideIcons from 'lucide-react';

interface InfoCardProps {
  iconName: keyof typeof LucideIcons;
  title: string;
  description: string;
  emphasisText?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  centered?: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  iconName,
  title,
  description,
  emphasisText,
  ctaText,
  onCtaClick,
  centered = false,
}) => {
  // Dynamically resolve Lucide Icon
  const IconComponent = LucideIcons[iconName] as React.ComponentType<{ className?: string }>;

  return (
    <div
      className={`
        /* Layout */
        flex flex-col h-full rounded-3xl p-8 transition-all duration-300
        
        /* Premium Soft-Chrome Background Gradient */
        bg-[linear-gradient(135deg,#F4F6F8_0%,#B6BBC2_100%)]
        
        /* Soft Reflective Border */
        border border-[#B6BBC2]/55
        
        /* Shadow and Hover Interaction Effects */
        shadow-[0_12px_28px_rgba(15,23,42,0.10)]
        hover:shadow-[0_18px_36px_rgba(15,23,42,0.14)]
        hover:-translate-y-1
        
        /* Alignment option */
        ${centered ? 'items-center text-center' : 'items-start text-left'}
      `}
    >
      {/* Icon Wrapper */}
      <div 
        className={`
          w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 shadow-inner
        `}
      >
        {IconComponent && <IconComponent className="w-7 h-7" />}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-[#0F172A] mb-3 tracking-tight">
        {title}
      </h3>

      {/* Supporting Text Description */}
      <p className="text-[#475569] text-sm md:text-base leading-relaxed mb-6 flex-grow">
        {description}
      </p>

      {/* Optional Emphasis Label */}
      {emphasisText && (
        <p className="text-blue-600 font-bold text-sm tracking-wide uppercase mb-4">
          {emphasisText}
        </p>
      )}

      {/* Optional CTA Link */}
      {ctaText && (
        <button
          onClick={onCtaClick}
          className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors mt-auto text-sm focus-visible:outline-none"
        >
          {ctaText}
          <LucideIcons.ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
```
