import { UriMatchType } from "../../../clients/libs/common/src/enums";

type LoginUriTemplate = {
  match: UriMatchType;
  uri: string;
};

type LoginItemTemplate = {
  uris: LoginUriTemplate[];
  username: string;
  password: string;
  totp: string;
};

type CardItemTemplate = {
  cardholderName: string;
  brand: string;
  number: string;
  expMonth: string;
  expYear: string;
  code: string;
};

type IdentityItemTemplate = {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  address1: string;
  address2: string | null;
  address3: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  company: string;
  email: string;
  phone: string;
  ssn: string;
  username: string;
  passportNumber: string;
  licenseNumber: string;
};

type FieldTemplate = {
  name: string;
  value: string;
  type: number;
};

type FolderTemplate = {
  name: string;
};

type ItemTemplate = {
  organizationId: string | null;
  collectionIds: string[] | null;
  folderId: string | null;
  type: number;
  name: string;
  notes: string;
  favorite: boolean;
  fields: FieldTemplate[];
  login: LoginItemTemplate | null;
  secureNote: null;
  card: CardItemTemplate | null;
  identity: IdentityItemTemplate | null;
  reprompt: 0 | 1;
};

type VaultItem = {
  id: string;
} & ItemTemplate;

type FolderItem = {
  object: string;
  id: string;
  FolderTemplate;
};

export {
  LoginUriTemplate,
  LoginItemTemplate,
  CardItemTemplate,
  IdentityItemTemplate,
  FieldTemplate,
  ItemTemplate,
  FolderTemplate,
  FolderItem,
  VaultItem,
};
