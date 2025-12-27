import { faker } from '@faker-js/faker';

export const fakeRow = {
  // 🔑 IDs & meta
  id: () => faker.number.int({ min: 1, max: 100000 }),
  uuid: () => faker.string.uuid().replaceAll('-', ''),

  // 👤 Personal info
  firstname: () => faker.person.firstName(),
  lastname: () => faker.person.lastName(),
  fullname: () => faker.person.fullName(),
  gender: () => faker.person.sex(), // 'male' | 'female'
  age: () => faker.number.int({ min: 18, max: 65 }),
  date_of_birth: () => faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),

  // 📧 Auth / contact
  email: () => faker.internet.email(),
  username: () => faker.internet.userName(),
  password: () => faker.internet.password({ length: 10 }),
  phone: () => faker.phone.number(),
  avatar: () => faker.image.avatar(),

  // 🌍 Location
  country: () => faker.location.country(),
  state: () => faker.location.state(),
  city: () => faker.location.city(),
  street: () => faker.location.streetAddress(),
  zip_code: () => faker.location.zipCode(),
  latitude: () => faker.location.latitude(),
  longitude: () => faker.location.longitude(),

  // 🏢 Company / work
  company: () => faker.company.name(),
  job_title: () => faker.person.jobTitle(),
  department: () => faker.commerce.department(),

  // 💰 Finance
  price: () => faker.commerce.price(),
  currency: () => faker.finance.currencyCode(),
  iban: () => faker.finance.iban(),
  account_number: () => faker.finance.accountNumber(),

  // 📝 Text / content
  title: () => faker.lorem.words(5),
  description: () => faker.lorem.sentences(2),
  paragraph: () => faker.lorem.paragraph(),
  bio: () => faker.person.bio(),

  // 🌐 Internet / system
  url: () => faker.internet.url(),
  ip_address: () => faker.internet.ip(),
  user_agent: () => faker.internet.userAgent(),

  // 📦 Status / flags
  is_active: () => faker.datatype.boolean(),
  is_verified: () => faker.datatype.boolean(),
  role: () => faker.helpers.arrayElement(['admin', 'user', 'manager']),

  // ⏱ Timestamps
  created_at: () => faker.date.past(),
  updated_at: () => faker.date.recent(),
  deleted_at: () => null,
};

export const ALLOWED_COLUMNS = Object.keys(fakeRow);
