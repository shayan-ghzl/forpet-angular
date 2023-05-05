export interface IBasket {
  id: string;
  basketItems: Product[];
  totalCount: string;
  totalDiscount: string;
  totalPureSum: string;
  totalSum: string;
}
export interface IBasketTotals {
  shipping: number;
  subtotal: number;
  total: number;
}
export interface Product {
  id: string;
  goodName: string;
  goodPageUrl: string;
  brandName: string;
  price: number;
  discount: number;
  finalPrice: number;
  count: number;
  imageUrl: string;
  goodType: number;
  technicalCode: string;
}
export interface Good {
  id: string;
  goodParent: IGoodParentDto | null;
  brand: IBrandDto | null;
  subBrand: IBrandDto | null;
  pageUrl: string;
  pageTitle: string;
  pageDescription: string;
  technicalCode: string;
  code: string;
  description: string;
  status: number;
  statusName: string;
  commentStatus: boolean;
  reviewUrl: string;
  previewUrl: string;
  previewSummeryUrl: string;
  goodImages: IGoodImageDto[];
  goodTags: string[] | null;
  goodQuantityParameters: string[];
  goodStorageAddresses: IGoodStorageAddressDto[];
  prices: IPrice[];
  userGroupPrice: IUserGroupPriceDto | null;
  stock: number;
  storageIODetails: IStorageIODetail[];
  persianLastBuyDate: string;
  lastBuyPrice: number;
  lastSellPrice: number;
  persianLastSalePriceUpdateDate: string,
  specialCode: string,
  isFocus?: boolean;
  buyLimit: number | null;
}
export interface IGoodGroupTypeDto {
  id: number;
  typeName: string;
  code: string;
  searched?: boolean
}
export interface IGoodGroupDto {
  id: number;
  name: string;
  nameEn: string | null;
  goodGroupTypeDto: IGoodGroupTypeDto;
  code: string;
  parent: IGoodGroupDto | null
  description: string | null;
  discount: number;
  status: number;
  statusTitle?: string;
  index: number;
  pageUrl: string | null;
  pageTitle: string | null;
  pageDescription: string | null;
  groupImageDtos?: IGroupImageDto[];
  inverseParents?: string[];
  goodGroupQualityParameterDtos?: string[];
  goodGroupQuantityParameterDtos?: string[];
  goodGoodGroupId?: string,
  searched?: boolean;
  children?: IGoodGroupDto[];
}
export interface IGroupImageDto {
  imageUrl: string;
  addressType: number;
}
export interface IGoodParentDto {
  id: string;
  name: string;
  unit: IGoodUnitDto | null;
  code: string;
  goodGroups: IGoodGroupDto[];
  barcodeSize: number;
  goodParentTags: IGoodParentTag[];
  price?: number;
  quantity?: number;
  total?: number;
}
export interface IGoodUnitDto {
  id: number;
  name: string;
}
export interface IBrandDto {
  id: number;
  name: string;
  nameEn: string | null;
  code: string;
  image: string;
  description: string;
  pageUrl: string;
  pageTitle: string;
  pageDescription: string;
  term: ITermDto | null;
  termId?: number;
}
export interface ITermDto {
  id: number;
  code: string;
  termDetails: ITermDetailDto[]
}
export interface ITermDetailDto {
  id: number;
  value: string
}
export interface IGoodImageDto {
  id: string;
  imageUrl: string;
  type: number;
}
export interface IGoodStorageAddressDto {
  storageSectionName: string;
  row: string;
  column: string;
  shelf: string;
}
export interface IGoodUnitDto {
  id: number;
  name: string;
}
export interface IPrice {
  userGroup: string;
  userGroupId: number;
  defaultPrice: number;
  userPrice: number;
  discount: number;
  discountPercent: number;
  finalPrice: number;
}
export interface IUserGroupPriceDto {
  id: number;
  userGroupId: number | null;
  userGroupName: string | null;
  goodId: string;
  price: number;
  discount: number;
}
export interface IStorageIODetail {
  storageIO: IStorageIO;
  count: number;
}
export interface IStorageIO {
  storage: IStorage;
  storageOperation: IInvoiceAndPayType;
}
export interface IStorage {
  id: number;
  name: string;
  code: string;
  description: string;
  status: number;
  storageSections: IStorageSectionDto[];
  branchStorages: IBranchStorage[];
}
export interface IStorageSectionDto {
  id: number;
  storage: IStorageDto | null;
  sectionName: string;
  goodStorageAddresses: IGoodStorageAddressDto[];
}
export interface IStorageDto {
  id: number;
  name: string;
  code: string;
  description: string;
  status: number;
  statusName: string;
  storageSections: IStorageSectionDto[];
  branchStorages: IBranchStorage[];
}
export interface IBranchStorage {
  id: number | undefined;
  storageId: number | null;
  branchId: number | null;
  branchName: string | null;
  branchCode: string | null;
  branchStatus: number | null;
  branchStatusName: string | null;
  branchDescription: string | null;
}
export interface IInvoiceAndPayType {
  code: number;
  name: string;
}
export interface IGoodParentTag {
  id: string;
  name: string;
}

export interface IGoodDto {
  id: string;
  goodParent: IGoodParentDto | null;
  brand: IBrandDto | null;
  subBrand: IBrandDto | null;
  pageUrl: string;
  pageTitle: string;
  pageDescription: string;
  technicalCode: string;
  code: string;
  description: string;
  status: number;
  statusName: string;
  commentStatus: boolean;
  reviewUrl: string;
  previewUrl: string;
  previewSummeryUrl: string;
  goodImages: IGoodImageDto[];
  goodTags: string[] | null;
  goodQuantityParameters: string[];
  goodStorageAddresses: IGoodStorageAddressDto[];
  prices: IPrice[];
  userGroupPrice: IUserGroupPriceDto | null;
  stock: number;
  storageIODetails: IStorageIODetail[];
  persianLastBuyDate: string;
  lastBuyPrice: number;
  lastSellPrice: number;
  persianLastSalePriceUpdateDate: string,
  specialCode: string,
  isFocus?: boolean;
  buyLimit: number | null;
}

export interface IUserDto {
  id: string;
  userName: string;
  password: string;
  passwordConfirm: string;
  rememberMe: boolean;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  nationalCode: string;
  smsCode: string;
  token: string;
  locations: IUserCityDto[];
  roles: IRoleDto[] | null;
  branches: IBranchDto[];
  userGroup: IUserGroupDto | null;
  isActive: boolean;
  isEmployee: boolean;
  parentBranchId: number;
  defaultCashAccount: IAccountDto | null;
  defaultBranchId?: number;
  persianBirthDate: string;
  birthDate: Date;
  storeName?: string;
}
export interface IRoleDto {
  id: string;
  name: string;
  description: string;
  normalizedName: string;
  ApplicationRoleClaimDtos: IApplicationRoleClaimDto[];
}
export interface IApplicationRoleClaimDto {
  id: number;
  roleId: string
  claimType: string;
  claimValue: string;
}
export interface IUserCityDto {
  id: number;
  country?: string;
  province?: string;
  city?: ICity;
  address?: string;
  postalCode?: string;
  tel?: string;
  lat?: number;
  lng?: number;
  selected?: boolean;
}
export interface ICity {
  id: number;
  name: string;
}
export interface IUserGroupDto {
  id: number;
  name: string;
  discount: number | null;
  code: string;
  parent: IUserGroupDto | null
}
export interface IAccountDto {
  id: string;
  name: string;
  code: string;
  type: number;
  typeName: string;
  status: number,
  statusName: string;
  parentId: string | null;
  parent: IAccountDto | null;
  user: IUserDto | null;
  tell: string | null;
  address: string | null;
  mobile: string | null;
  inverseParents?: IAccountDto[] | null;
  trAccounts?: ITrAccountDto[];
}
export interface ITrAccountDto {
  account: IAccountDto;
  transaction: ITransactionDto;
}
export interface ITransactionDto {
  id: string;
  trPay: ITrPayDto;
  trAccount: ITrAccountDto;
  trDate: ITrDateDto;
  trInvoice: ITrInvoiceDto;
  docId: number;
  docParentId: number;
  debtor: number;
  creditor: number;
  description: string;
  inInvoice: boolean;
  branchId: number;
  branch: IBranchDto;
  termId: number;
  term: ITermDto;
  modifyState?: number; // 1: checked: sabz , 2: checked and edited: zard
}
export interface IBranchDto {
  id: number;
  name: string;
  code: string;
  description: string;
  status: number;
  statusName: string;
  printName: string;
  printAddress: string;
  printTel: string;
}
export interface ITrInvoiceDto {
  invoiceId: string;
  transaction: ITransactionDto;
}
export interface ITrDateDto {
  date: Date;
  persianDate: Date;
}
export interface ITrPayDto {
  payType: number;
  operationType: number;
  trCheck: ITrCheckDto;
  trAccount: ITrAccountDto;
  trDate: ITrDateDto;
}
export interface ITrCheckDto {
  check: ICheckDto;
  trAccount: ITrAccountDto;
  trDate: ITrDateDto;
}
export interface ICheckDto {
  id: string;
  docId: number;
  docParentId: number;
  transferType: number;
  receiptStatus: number;
  price: number;
  persianDate: string;
  receiveDate: Date;
  receiptDate: Date;
  registerDate: Date;
  persianReceiveDate: string;
  persianReceiptDate: string;
  persianRegisterDate: string;
  checkNumber: string;
  bankAccountNo: string;
  serialCheck: string;
  bank: IBankDto | null;
  bankName: number;
  bankBranch: string;
  description: string;
  account: IAccountDto | null;
  bankAccount: IAccountDto | null;
  accountId: string;
  bankAccountId: string;
  logChecks: ILogEntityDto[];
  branchId: number | null;
  term: ITermDto;
  termId: number;
}
export interface ILogDto {
  registerDate: Date;
  persianRegisterDate: string;
  user: IUserDto;
  logOperation: number;
  description: string;
}
export interface ILogEntityDto {
  log: ILogDto;
}
export interface IBankDto {
  name: string;
  code: number;
}