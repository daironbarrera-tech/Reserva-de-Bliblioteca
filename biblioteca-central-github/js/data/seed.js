/* Datos iniciales: libros de ejemplo y cuenta del bibliotecario */
const makeBook = (title, author, year, pages, signature, floor, section, shelf, category, copies) => ({
  id: signature.replace(/\W/g, ''),
  title, author, year, pages, signature, floor, section, shelf, category, copies,
});

function createSeed() {
  return {
    users: [
      { id: 'u0', name: 'Bibliotecario', email: 'bibliotecario@biblioteca.com', password: 'admin123', role: 'librarian' },
    ],
    reservations: [],
    books: [
      makeBook('El arte de la guerra',             'Sun Tzu',                2019, 128, '355 S957a',    2, 'A', 7,  'Historia',   2),
      makeBook('Sapiens: de animales a dioses',    'Yuval Noah Harari',      2014, 496, '909 H254s',    2, 'A', 3,  'Historia',   2),
      makeBook('Así habló Zaratustra',             'Friedrich Nietzsche',    1883, 352, '193 N677a',    3, 'B', 5,  'Filosofía',  2),
      makeBook('Breve historia del tiempo',        'Stephen Hawking',        1988, 256, '523.1 H393b',  2, 'D', 6,  'Ciencias',   2),
      makeBook('Cartas a un joven poeta',          'Rainer Maria Rilke',     1929, 96,  '831 R573c',    1, 'C', 1,  'Literatura', 2),
      makeBook('Cien años de soledad',             'Gabriel García Márquez', 1967, 471, '863 G216c',    1, 'C', 2,  'Literatura', 2),
      makeBook('Estructuras de datos y algoritmos', 'Alfred V. Aho',         1998, 424, '005.73 A286e', 2, 'D', 11, 'Ciencias',   2),
      makeBook('La historia del arte',             'E. H. Gombrich',         1950, 688, '709 G632h',    3, 'E', 9,  'Arte',       2),
      makeBook('Meditaciones',                     'Marco Aurelio',          2003, 208, '181 M428m',    3, 'B', 1,  'Filosofía',  1),
      makeBook('Rayuela',                          'Julio Cortázar',         1963, 736, '863 C828r',    1, 'C', 12, 'Literatura', 2),
      makeBook('El origen de las especies',        'Charles Darwin',         1859, 502, '576.8 D228o',  2, 'D', 2,  'Ciencias',   2),
      makeBook('La república',                     'Platón',                 2010, 384, '184 P718r',    3, 'B', 3,  'Filosofía',  2),
    ],
  };
}
