import { BountyCollection } from '@app/models/Bounty';
import axios from '@app/utils/AxiosUtils';
import {
	Alert,
	AlertIcon,
	AlertTitle,
	Button,
	CloseButton,
	Box,
	Text,
	Tooltip,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import bountyStatus from '@app/constants/bountyStatus';
import { useMemo, useState } from 'react';
import activity, { CLIENT } from '@app/constants/activity';
import { useUser } from '@app/hooks/useUser';
import { useRoles } from '@app/hooks/useRoles';
import PAID_STATUS from '@app/constants/paidStatus';
import { mutate } from 'swr';

const useShowPublishBountyButton = (bounty: BountyCollection): boolean => {
	const { user } = useUser();
	const roles = useRoles();
	const show = useMemo(() => {
		const isDraft = bounty.status === bountyStatus.DRAFT;
		const isOwnBounty = bounty.createdBy.discordId === user?.id;
		const isAdmin = roles.includes('admin');
		return (isAdmin || isOwnBounty) && isDraft;
	}, [bounty, roles, user]);
	return show;
};

const BountyPublish = ({
	bounty,
}: {
	bounty: BountyCollection;
}): JSX.Element => {
	const router = useRouter();
	const [error, setError] = useState('');
	const show = useShowPublishBountyButton(bounty);
	const helpMessage = 'Publish this bounty to the Bounty Board';
	const upload = () => {
		// update the status of the bounty from DRAFT to OPEN before posting
		bounty.status = bountyStatus.OPEN;
		bounty.paidStatus = PAID_STATUS.UNPAID;
		bounty.statusHistory.push({
			modifiedAt: new Date().toISOString(),
			status: bountyStatus.OPEN,
		});
		bounty.activityHistory.push({
			modifiedAt: new Date().toISOString(),
			activity: activity.PUBLISH,
			client: CLIENT.BOUNTYBOARD,
		});

		if (bounty._id) {
			// Update an existing draft bounty
			const updatedBounty = Object.assign({}, bounty, { id: undefined, __v: undefined });
			axios
				.patch<{ data: BountyCollection }>(
					`api/bounties/${bounty._id}?customerId=${bounty.customerId}`,
					updatedBounty,
					{
						baseURL: '/',
					}
				)
				.then(({ data: res }) => {
					mutate(`/api/bounties/${bounty._id}`, res.data);
					router.push(`/${bounty._id}`);
					localStorage.removeItem('cachedEdit');
				})
				.catch((err) => {
					setError('There was a problem publishing the bounty');
					// cannot assume shape of error but we prefer to get the response data
					console.warn(err.response?.data ?? err);
				});


		} else {

			// Add the bounty to the DB
			axios
				.post<any, { data: { data: BountyCollection } }>(
					`api/bounties?customerId=${bounty.customerId}`,
					bounty
				)

			// on success, sent the user to the bounty/bountyId page of the newly created bounty
				.then(({ data: res }) => {
					router
						.push(`/${res.data._id}`)

					// once on the 'live' bounty page, remove all the prev bounty data
					// from localstorage
						.then(() => {
							localStorage.removeItem('cachedEdit');
							localStorage.removeItem('previewBounty');
						});
				})
			// if there was a problem, log the error to the console
				.catch((err) => {
					setError('There was a problem publishing the bounty');
					// cannot assume shape of error but we prefer to get the response data
					console.warn(err.response?.data ?? err);
				});
		}
	};
	return (
		<>
			{show && (
				<>
					<Tooltip
						hasArrow
						label={helpMessage}
						shouldWrapChildren
						mt="3"
						display='hidden'
					>
						<Box p={2}>
							<Button colorScheme="primary" onClick={() => upload()}>
								Publish
							</Button>
						</Box>
						<Text
							as="i"
							my={1}
							color="primary.500"
							display='none'
						>
							{helpMessage}
						</Text>
					</Tooltip>
				</>
			)}
			{error && (
				<Alert status="error">
					<AlertIcon />
					<AlertTitle mr={2}>{error}</AlertTitle>
					<CloseButton
						position="absolute"
						right="8px"
						top="8px"
						onClick={() => setError('')}
					/>
				</Alert>
			)}
		</>
	);
};

export default BountyPublish;
