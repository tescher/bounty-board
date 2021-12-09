import { BountyCollection } from "../../src/models/Bounty";

export const testBounty: Omit<
  BountyCollection,
  "_id"
> = {
  customer_id: "834499078434979890",
  season: 1,
  title: "TEST TITLE",
  description: "TEST DESCRIPTION",
  criteria: "TEST CRITERIA",
  editKey: "123",
  reward: {
    currency: "BANK",
    amount: 1000,
    scale: 2,
    amountWithoutScale: 10
  },
  claimedBy: {
    discordHandle: null,
    discordId: null,
  },
  reviewedBy: {
    discordHandle: null,
    discordId: null,
  },
  submittedBy: {
    discordHandle: null,
    discordId: null,
  },    
  createdBy: {
    discordHandle: "TESTHANDLE#1234",
    discordId: "324439902343239764"
  },
  createdAt: "2021-07-20T06:40:56.112Z",
  dueAt: "2021-07-20T06:42:28.853Z",
  claimedAt: "2021-07-20T07:00:31.166Z",
  status: "Open",
  statusHistory: [
    {
      status: "Open",
      modifiedAt: "2021-07-20T07:00:31.166Z"
    }
  ]
}