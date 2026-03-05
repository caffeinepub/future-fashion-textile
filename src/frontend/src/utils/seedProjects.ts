import { ProjectCategory } from "../backend.d";
import type { backendInterface } from "../backend.d";

const SEED_KEY = "fft_seeded_v1";

const seedData = [
  {
    title: "Rosette Bloom Collection",
    description:
      "Delicate rose and botanical motifs in a half-drop repeat. Designed for lightweight chiffon and crepe fabrics. Available in 6 colorways including dusty pink, sage, and deep burgundy.",
    category: ProjectCategory.uiUx,
    imageUrl: "/assets/generated/pattern-floral.dim_800x600.jpg",
  },
  {
    title: "Terracotta Grid Series",
    description:
      "Bold geometric block prints inspired by traditional Ajrak tile patterns. Features angular motifs in warm earthy tones. Suitable for home textiles, cotton kurtas, and structured wear.",
    category: ProjectCategory.branding,
    imageUrl: "/assets/generated/pattern-geometric.dim_800x600.jpg",
  },
  {
    title: "Watercolor Wash Pattern",
    description:
      "Abstract watercolor brushstroke repeat in soft blush and dusty burgundy. An organic, artisanal aesthetic perfect for summer collections and premium athleisure.",
    category: ProjectCategory.graphicDesign,
    imageUrl: "/assets/generated/pattern-abstract.dim_800x600.jpg",
  },
  {
    title: "Royal Paisley Damask",
    description:
      "Intricate paisley and damask-inspired print drawing from Mughal textile heritage. Rendered in deep burgundy with gold highlights for luxury sarees, dupattas, and bridal fabric.",
    category: ProjectCategory.uiUx,
    imageUrl: "/assets/generated/pattern-paisley.dim_800x600.jpg",
  },
  {
    title: "Ikat Stripe Collection",
    description:
      "Contemporary ikat-inspired stripe patterns in warm rust and cream. Developed for woven fabrics and printed linen, with four coordinating colorways.",
    category: ProjectCategory.branding,
    imageUrl: "/assets/generated/pattern-stripe.dim_800x600.jpg",
  },
  {
    title: "Botanical Leaf Print",
    description:
      "Hand-painted botanical leaf motifs in sage green and terracotta on ivory. Versatile placement and all-over variants designed for premium cotton and organic muslin fabrics.",
    category: ProjectCategory.graphicDesign,
    imageUrl: "/assets/generated/pattern-botanical.dim_800x600.jpg",
  },
];

export async function seedProjectsIfNeeded(
  actor: backendInterface,
): Promise<void> {
  if (sessionStorage.getItem(SEED_KEY)) return;

  try {
    const existing = await actor.listProjects(null);
    if (existing.length > 0) {
      sessionStorage.setItem(SEED_KEY, "true");
      return;
    }

    await Promise.all(
      seedData.map((p) =>
        actor.createProject(p.title, p.description, p.category, p.imageUrl),
      ),
    );

    sessionStorage.setItem(SEED_KEY, "true");
  } catch {
    // Seed failed silently — will retry next session
  }
}
