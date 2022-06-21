import { Member, Organization } from '@foxpage/foxpage-server-types';

import { MemberInfo, Search } from './index-types';

export type MemberBase = Pick<Member, 'userId' | 'status'>;
export type NewOrgParams = Pick<Organization, 'id' | 'name' | 'creator'>;
export type OrgBaseInfo = Pick<Organization, 'id' | 'name'>;
export type OrgInfo = Exclude<Organization, 'creator' | 'members'> & {
  creator: { id: string; account: string };
} & {
  members: MemberInfo[];
};

export interface OrgAppFolderSearch extends Search{
  organizationId: string;
  type: string;
  applicationIds?: string[];
}
