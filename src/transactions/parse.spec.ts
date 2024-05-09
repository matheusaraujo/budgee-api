import { parse } from './parse';

describe('parse', () => {
  it.each`
    description              | input                            | output
    ${'category'}            | ${'#house'}                      | ${{ category: 'house' }}
    ${'date'}                | ${'@2024-05-08'}                 | ${{ date: new Date('2024-05-08') }}
    ${'amount'}              | ${'123'}                         | ${{ amount: 123 }}
    ${'float amount'}        | ${'123.45'}                      | ${{ amount: 123.45 }}
    ${'description'}         | ${'desc'}                        | ${{ description: 'desc' }}
    ${'long description'}    | ${'desc desc2'}                  | ${{ description: 'desc desc2' }}
    ${'splited description'} | ${'desc 123 desc2'}              | ${{ description: 'desc desc2', amount: 123 }}
    ${'all fields'}          | ${'#house @2024-05-08 123 desc'} | ${{ category: 'house', date: new Date('2024-05-08'), amount: 123, description: 'desc' }}
  `('should parse $description ', ({ input, output }) => {
    expect(parse(input)).toEqual(output);
  });
});
