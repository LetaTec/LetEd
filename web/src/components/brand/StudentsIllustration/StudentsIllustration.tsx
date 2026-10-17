import { useId } from 'react';
import cx from 'classnames/bind';

import styles from './StudentsIllustration.module.css';

const cn = cx.bind(styles);

export type StudentsIllustrationProps = {
  label: string;
  className?: string;
};

// Hand-drawn brand illustration: four students learning inside circular
// scenes, with learning badges around them. Deliberately static — the
// layout never moves. Colours come from tokens.
export const StudentsIllustration = ({
  label,
  className,
}: StudentsIllustrationProps) => {
  const id = useId().replace(/:/g, '');
  const clip = (name: string) => `${id}-${name}`;

  return (
    <svg
      viewBox="0 0 640 540"
      role="img"
      aria-label={label}
      className={cn('illustration', className)}
    >
      <defs>
        <clipPath id={clip('a')}>
          <circle cx="200" cy="215" r="165" />
        </clipPath>
        <clipPath id={clip('b')}>
          <circle cx="460" cy="130" r="105" />
        </clipPath>
        <clipPath id={clip('c')}>
          <circle cx="340" cy="420" r="100" />
        </clipPath>
        <clipPath id={clip('d')}>
          <circle cx="540" cy="375" r="118" />
        </clipPath>
      </defs>

      {/* A — student with headphones on a laptop, waving */}
      <g>
        <circle cx="200" cy="215" r="165" className={cn('sky')} />
        <g clipPath={`url(#${clip('a')})`}>
          <rect
            x="88"
            y="92"
            width="225"
            height="140"
            rx="8"
            className={cn('board')}
          />
          <path
            d="M108 122h70M108 142h110M108 162h50M108 182h90"
            className={cn('boardLine')}
          />
          <path d="M230 120l40 30-40 30" className={cn('boardLine')} />
          <path
            d="M76 400c8-78 64-112 124-112s118 34 126 112z"
            className={cn('teal')}
          />
          <path d="M150 300l20 60M250 300l-20 60" className={cn('seam')} />
          <rect
            x="184"
            y="262"
            width="32"
            height="40"
            rx="10"
            className={cn('skin')}
          />
          <circle cx="200" cy="228" r="54" className={cn('skin')} />
          <path
            d="M146 222c-4-52 40-78 84-66 26 7 38 32 30 56-14-14-40-20-64-14-20 5-36 14-50 24z"
            className={cn('hair')}
          />
          <path d="M142 230a60 60 0 0 1 118-14" className={cn('band')} />
          <ellipse cx="144" cy="242" rx="15" ry="24" className={cn('cup')} />
          <circle cx="182" cy="234" r="14" className={cn('glasses')} />
          <circle cx="222" cy="234" r="14" className={cn('glasses')} />
          <path d="M196 234h12" className={cn('glassesBridge')} />
          <circle cx="183" cy="235" r="3.5" className={cn('eye')} />
          <circle cx="223" cy="235" r="3.5" className={cn('eye')} />
          <circle cx="172" cy="256" r="8" className={cn('cheek')} />
          <circle cx="234" cy="256" r="8" className={cn('cheek')} />
          <path d="M188 262q14 14 28 0" className={cn('smile')} />
          <path d="M252 332l92-30 26 108-102 22z" className={cn('laptop')} />
          <rect
            x="98"
            y="300"
            width="40"
            height="58"
            rx="18"
            className={cn('skin')}
          />
          <path
            d="M104 304v-26M115 300v-32M126 300v-30M136 306v-20"
            className={cn('finger')}
          />
        </g>
      </g>

      {/* B — student reading on a tablet */}
      <g>
        <circle cx="460" cy="130" r="105" className={cn('sand')} />
        <g clipPath={`url(#${clip('b')})`}>
          <path d="M412 92l26 16v30l-26 16-26-16v-30z" className={cn('hex')} />
          <path
            d="M358 260c8-62 52-88 102-88s96 26 104 88z"
            className={cn('sage')}
          />
          <rect
            x="446"
            y="150"
            width="28"
            height="32"
            rx="10"
            className={cn('skin')}
          />
          <circle cx="470" cy="120" r="40" className={cn('hairBack')} />
          <circle cx="498" cy="146" r="22" className={cn('hairBack')} />
          <circle cx="458" cy="126" r="36" className={cn('skin')} />
          <path
            d="M424 116c2-34 34-48 62-36 14 6 18 22 12 34-16-12-48-14-74 2z"
            className={cn('hair')}
          />
          <circle cx="446" cy="130" r="3.2" className={cn('eye')} />
          <circle cx="470" cy="130" r="3.2" className={cn('eye')} />
          <circle cx="440" cy="144" r="6" className={cn('cheek')} />
          <path d="M448 148q9 8 18 0" className={cn('smile')} />
          <circle cx="492" cy="128" r="5" className={cn('earbud')} />
          <g transform="rotate(-18 432 205)">
            <rect
              x="402"
              y="182"
              width="62"
              height="44"
              rx="6"
              className={cn('device')}
            />
            <rect
              x="408"
              y="188"
              width="50"
              height="32"
              rx="3"
              className={cn('screen')}
            />
            <circle cx="433" cy="200" r="7" className={cn('sky')} />
          </g>
          <rect
            x="452"
            y="200"
            width="24"
            height="30"
            rx="10"
            className={cn('skin')}
          />
        </g>
      </g>

      {/* C — student with glasses writing in a notebook */}
      <g>
        <circle cx="340" cy="420" r="100" className={cn('sage')} />
        <g clipPath={`url(#${clip('c')})`}>
          <rect
            x="370"
            y="340"
            width="70"
            height="90"
            rx="4"
            className={cn('window')}
          />
          <path d="M405 340v90M370 385h70" className={cn('windowLine')} />
          <path
            d="M262 540c6-64 40-92 78-92s72 28 78 92z"
            className={cn('rust')}
          />
          <path d="M300 352c-20 10-30 50-24 100h40z" className={cn('hair')} />
          <rect
            x="327"
            y="420"
            width="26"
            height="30"
            rx="9"
            className={cn('skin')}
          />
          <circle cx="340" cy="398" r="34" className={cn('skin')} />
          <path
            d="M306 396c-2-32 26-48 52-40 16 5 22 18 18 30-14-10-44-12-70 10z"
            className={cn('hair')}
          />
          <circle cx="326" cy="402" r="11" className={cn('glasses')} />
          <circle cx="354" cy="402" r="11" className={cn('glasses')} />
          <path d="M337 402h6" className={cn('glassesBridge')} />
          <circle cx="327" cy="403" r="3" className={cn('eye')} />
          <circle cx="355" cy="403" r="3" className={cn('eye')} />
          <path d="M332 420q8 7 16 0" className={cn('smile')} />
          <g transform="rotate(-10 360 478)">
            <rect
              x="320"
              y="462"
              width="84"
              height="40"
              rx="3"
              className={cn('paper')}
            />
            <path d="M330 474h50M330 486h36" className={cn('boardLine')} />
          </g>
          <path d="M392 446l14-30" className={cn('pencil')} />
          <rect
            x="378"
            y="440"
            width="24"
            height="22"
            rx="9"
            className={cn('skin')}
          />
        </g>
      </g>

      {/* D — student on a phone, earning a star */}
      <g>
        <circle cx="540" cy="375" r="118" className={cn('lilac')} />
        <g clipPath={`url(#${clip('d')})`}>
          <path
            d="M436 560c8-80 50-116 104-116s98 36 106 116z"
            className={cn('rustDeep')}
          />
          <rect
            x="526"
            y="390"
            width="30"
            height="36"
            rx="10"
            className={cn('skin')}
          />
          <circle cx="541" cy="352" r="44" className={cn('skin')} />
          <path
            d="M498 346c-6-42 30-64 64-54 22 6 32 26 26 44-18-16-54-20-90 10z"
            className={cn('hair')}
          />
          <circle cx="526" cy="358" r="3.6" className={cn('eye')} />
          <circle cx="556" cy="358" r="3.6" className={cn('eye')} />
          <circle cx="516" cy="374" r="7" className={cn('cheek')} />
          <circle cx="568" cy="374" r="7" className={cn('cheek')} />
          <path d="M530 380q12 11 24 0" className={cn('smile')} />
          <ellipse cx="584" cy="396" rx="18" ry="30" className={cn('skin')} />
          <g transform="rotate(-14 494 420)">
            <rect
              x="472"
              y="388"
              width="44"
              height="72"
              rx="8"
              className={cn('device')}
            />
            <rect
              x="477"
              y="396"
              width="34"
              height="54"
              rx="4"
              className={cn('screen')}
            />
          </g>
          <rect
            x="474"
            y="426"
            width="34"
            height="40"
            rx="14"
            className={cn('skin')}
          />
          <rect
            x="470"
            y="470"
            width="150"
            height="10"
            rx="3"
            className={cn('desk')}
          />
        </g>
        <g>
          <circle cx="470" cy="282" r="26" className={cn('paper')} />
          <path
            d="M470 268l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z"
            className={cn('gold')}
          />
        </g>
      </g>

      {/* Floating learning badges */}
      <g>
        <circle cx="70" cy="440" r="36" className={cn('sky')} />
        <text x="70" y="452" textAnchor="middle" className={cn('badgeText')}>
          A+
        </text>
      </g>
      <g>
        <circle cx="160" cy="492" r="34" className={cn('blush')} />
        <path d="M150 474l26 18-26 18z" className={cn('paperFill')} />
      </g>
      <g>
        <circle cx="610" cy="186" r="26" className={cn('sand')} />
        <rect
          x="598"
          y="172"
          width="24"
          height="28"
          rx="3"
          className={cn('paperFill')}
        />
        <path d="M603 181h14M603 188h14M603 195h8" className={cn('docLine')} />
      </g>
      <g>
        <circle cx="596" cy="72" r="24" className={cn('lilac')} />
        <path
          d="M600 56l-12 18h10l-4 16 12-20h-10z"
          className={cn('paperFill')}
        />
      </g>
      <g>
        <circle cx="48" cy="96" r="18" className={cn('sage')} />
        <path d="M40 96l6 6 11-12" className={cn('tick')} />
      </g>
    </svg>
  );
};
