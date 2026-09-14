import { Component, signal } from '@angular/core';
import { BackNav } from '../../shared/back-nav/back-nav';

interface QaEntry {
  term: string;
  question: string;
  answer: string;
}

interface EssayPrompt {
  title: string;
  description: string;
}

@Component({
  imports: [BackNav],
  selector: 'app-colorblindness-qa',
  styleUrl: './colorblindness-qa.scss',
  templateUrl: './colorblindness-qa.html',
})
export class ColorblindnessQa {
  protected readonly entries: QaEntry[] = [
    {
      term: 'Phototransduction',
      question: 'What is the primary function of phototransduction in the human retina?',
      answer:
        'Phototransduction is the biological process that occurs in photoreceptor cells where light is converted into electrical signals that the nervous system can interpret. This conversion is a highly amplified signaling cascade that translates electromagnetic radiation into graded membrane hyperpolarizations.',
    },
    {
      term: 'Rod Cells in Dark vs. Light',
      question: 'How do rod cells behave in the dark compared to when they are exposed to light?',
      answer:
        'In the dark, rod cells remain in a depolarized state because high levels of cGMP keep sodium ion channels open, leading to a continuous release of the neurotransmitter glutamate. When light is absorbed, cGMP levels fall, causing these ion channels to close, which hyperpolarizes the cell and decreases glutamate release as a signal to the brain.',
    },
    {
      term: 'Red-Green Color Vision Deficiency',
      question: 'What is the physiological cause of red-green color vision deficiency (CVD)?',
      answer:
        'Red-green CVD occurs when there is a pronounced overlap in the sensitivity of the red (L-cone) and green (M-cone) photopigments. This overlap causes the retina to receive inaccurate ratios of light, making the brain struggle to distinguish between various hues within the red and green spectrum.',
    },
    {
      term: 'Notch Filters',
      question:
        'How do "notch filters" in color blind glasses, such as those made by EnChroma, assist the wearer?',
      answer:
        'These filters are engineered to remove specific "slices" or wavelengths of light where the problematic overlap between red and green cones is most severe. By filtering out these confusing wavelengths, the glasses establish a more accurate ratio of light entering the photopigments, thereby enhancing color discrimination and vibrancy.',
    },
    {
      term: 'Dichromat vs. Anomalous Trichromat',
      question:
        'What is the primary difference between a "dichromat" and an "anomalous trichromat" in the context of an anomaloscope test?',
      answer:
        "An anomalous trichromat possesses three types of cones but requires a different proportion of red and green light to match a yellow reference than a normal observer. In contrast, a dichromat lacks one cone type entirely and can match the yellow reference to any mixture of red or green light simply by adjusting the light's intensity.",
    },
    {
      term: 'OLED Burn-In',
      question:
        'What is "burn-in" on OLED displays, and how does the Super Retina XDR display mitigate it?',
      answer:
        'Burn-in is a form of image persistence where a faint remnant of an image remains on the screen after long-term use of high-contrast images at high brightness. iPhone displays use special algorithms to monitor individual pixel usage and automatically adjust brightness levels to reduce these effects and maintain a consistent viewing experience.',
    },
    {
      term: 'Achromatopsia Gene Therapy in Children',
      question:
        'Why was the achromatopsia gene therapy trial targeted specifically at children and adolescents?',
      answer:
        'Researchers believe the therapy is most effective in younger patients because the neural circuits in their brains are still developing and highly adaptable. This flexibility allows the brain to successfully interpret and utilize new visual signals that the patient has never experienced before.',
    },
    {
      term: 'Arrestin',
      question: 'What is the role of the protein arrestin in the phototransduction cascade?',
      answer:
        'Arrestin is responsible for helping the rod cell return to its normal state after being activated by light. It binds to inactivated rhodopsin, blocking its ability to activate further transducin and effectively stopping the signaling cascade.',
    },
    {
      term: 'X-Linked Inheritance',
      question:
        'Explain the genetic reason why men are more likely to suffer from red-green color blindness than women.',
      answer:
        'The genes for red and green photopigments are located on the X-chromosome; since men have only one X-chromosome, a single defective gene causes the condition. Women have two X-chromosomes, meaning a normal gene on one can typically compensate for a defective gene on the other.',
    },
    {
      term: 'Stiles-Crawford Effect',
      question: 'How does the Stiles-Crawford effect influence light perception?',
      answer:
        'The Stiles-Crawford effect is a biophysical phenomenon where light entering the center of the pupil appears brighter and more saturated than light entering near the edge. This is due to the physical alignment of foveal cones, which act like optical fibers to guide light directly into the photopigment-rich segments of the cell.',
    },
  ];

  protected readonly essayPrompts: EssayPrompt[] = [
    {
      title: 'Intervention Efficacy',
      description:
        'Compare and contrast the effectiveness of passive optical aids (like EnChroma and VINO glasses) with active medical interventions (such as gene therapy for achromatopsia). Discuss the limitations of each in "curing" color vision deficiency.',
    },
    {
      title: 'The Genetics of Vision',
      description:
        'Detail the molecular mechanisms of unequal homologous recombination at the Xq28 locus. How do these genetic "misalignments" lead to the specific variations seen in protan and deutan defects?',
    },
    {
      title: 'Display Technology and Human Physiology',
      description:
        'Analyze how OLED display engineering (specifically Super Retina XDR) attempts to mimic or accommodate the high standards of human visual perception, particularly regarding contrast, color accuracy, and high dynamic range.',
    },
    {
      title: 'Neural Pathways',
      description:
        'Discuss the parallel processing streams in the primate retina (Parvocellular, Magnocellular, and Koniocellular). How do these pathways reconcile the trichromatic theory of detection with the opponent-process theory of perception?',
    },
    {
      title: 'Diagnostic Accuracy',
      description:
        'Evaluate the anomaloscope as the "gold standard" for clinical diagnosis. Why is it superior to simpler tests like the Arrangement plates or FM-100 Hue test in distinguishing between dichromacy and anomalous trichromacy?',
    },
  ];

  private readonly openTerms = signal<ReadonlySet<string>>(new Set());

  protected isOpen(term: string): boolean {
    return this.openTerms().has(term);
  }

  protected toggle(term: string): void {
    const next = new Set(this.openTerms());
    if (next.has(term)) {
      next.delete(term);
    } else {
      next.add(term);
    }
    this.openTerms.set(next);
  }
}
