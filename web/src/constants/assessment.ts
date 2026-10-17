// Decorative preview of a generated test paper, using the GST topic on offer.
export const TEST_PAPER_PREVIEW = {
  brand: 'SriDha Academy / AI Assessment',
  count: 'Q 01–03 / 25',
  title: 'Test',
  titleEnd: 'Paper',
  meta: ['Accounts · Class 11', 'Topic: GST', 'Max. marks 25'],
  instruction: 'Choose the correct option. Each question carries 1 mark',
  marksLabel: '1 mark',
  questions: [
    {
      index: '01',
      prompt: 'Input Tax Credit under GST can be set off against',
      options: [
        { key: 'a', label: 'Output tax liability' },
        { key: 'b', label: 'Income tax payable' },
        { key: 'c', label: 'Customs duty on imports' },
        { key: 'd', label: 'Cost of goods purchased' },
      ],
      selected: 'a',
    },
    {
      index: '02',
      prompt: 'Goods sold within the same state attract',
      options: [
        { key: 'a', label: 'IGST only' },
        { key: 'b', label: 'CGST and SGST' },
        { key: 'c', label: 'CGST only' },
        { key: 'd', label: 'No GST' },
      ],
      selected: 'b',
    },
    {
      index: '03',
      prompt: 'On a credit purchase, GST paid is debited to',
      options: [
        { key: 'a', label: 'Purchases A/c' },
        { key: 'b', label: 'Creditors A/c' },
        { key: 'c', label: 'Input CGST & SGST A/c' },
        { key: 'd', label: 'Output GST A/c' },
      ],
      selected: null,
    },
  ],
  progress: 'Answered 2 of 25',
  timeLeft: 'Time left 18:40',
} as const;
