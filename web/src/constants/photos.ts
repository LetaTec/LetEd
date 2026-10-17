import studentOverwhelmed from '@/assets/photos/student-overwhelmed.webp';
import studentReading from '@/assets/photos/student-reading.webp';
import studentWriting from '@/assets/photos/student-writing.webp';
import studentsSmiling from '@/assets/photos/students-smiling.webp';

// Photographs licensed CC BY 2.0 (https://creativecommons.org/licenses/by/2.0/).
// The licence requires crediting the photographer wherever a photo appears.
export const STUDENT_PHOTOS = {
  overwhelmed: {
    src: studentOverwhelmed,
    alt: 'A schoolboy resting his chin on his hands, looking overwhelmed',
    credit: 'Photo: Nithi clicks / Flickr, CC BY 2.0',
  },
  reading: {
    src: studentReading,
    alt: 'A schoolboy holding open a workbook',
    credit: 'Photo: Nithi clicks / Flickr, CC BY 2.0',
  },
  smiling: {
    src: studentsSmiling,
    alt: 'Three smiling schoolgirls in uniform walking home from school',
    credit: 'Photo: Nithi clicks / Flickr, CC BY 2.0',
  },
  writing: {
    src: studentWriting,
    alt: 'A student writing answers in a notebook',
    credit: 'Photo: KMo Foto / Flickr, CC BY 2.0',
  },
} as const;

export type StudentPhotoKey = keyof typeof STUDENT_PHOTOS;
