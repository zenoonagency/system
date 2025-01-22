export type CustomFieldType = 'text' | 'number' | 'date' | 'boolean' | 'file';

export interface CustomField {
  type: CustomFieldType;
  value: string;
}

export interface CustomFieldInput {
  id: string;
  name: string;
  type: CustomFieldType;
  value: string;
}

export const fieldTypes: { value: CustomFieldType; label: string }[] = [
  { value: 'text', label: 'Texto' },
  { value: 'number', label: 'Número' },
  { value: 'date', label: 'Data' },
  { value: 'boolean', label: 'Sim/Não' },
  { value: 'file', label: 'Arquivo' },
];

export function renderCustomFieldValue(type: CustomFieldType, value: string): string | React.ReactNode {
  switch (type) {
    case 'boolean':
      return value === 'true' ? 'Sim' : 'Não';
    case 'file':
      return {
        type: 'a',
        props: {
          href: '#',
          className: 'text-[#7f00ff] hover:underline',
          children: value
        }
      };
    default:
      return value;
  }
}