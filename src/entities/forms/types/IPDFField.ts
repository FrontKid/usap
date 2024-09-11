type PDFFieldType =
  | 'PDFCheckBox'
  | 'PDFTextField'
  | 'PDFRadioGroup'
  | 'PDFDropdown'
  | 'PDFOptionList';

interface BasePDFField {
  name: string;
  type: PDFFieldType;
}

interface PDFCheckBoxField extends BasePDFField {
  type: 'PDFCheckBox';
  checked: boolean;
}

interface PDFTextField extends BasePDFField {
  type: 'PDFTextField';
  value: string;
}

interface PDFRadioGroup extends BasePDFField {
  type: 'PDFRadioGroup';
  selected: string | number;
}
interface PDFOptionList extends BasePDFField {
  type: 'PDFOptionList';
  selected: string[] | number[];
}

interface PDFDropdown extends BasePDFField {
  type: 'PDFDropdown';
  selected: string[];
}

type IPDFField =
  | PDFCheckBoxField
  | PDFTextField
  | PDFRadioGroup
  | PDFDropdown
  | PDFOptionList;

export type { IPDFField };
