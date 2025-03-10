import { useUser } from '@app/hooks/useUser';
import {
	ActivityHistoryItem,
	BountyClaimCollection,
	BountyCollection,
	StatusHistoryItem,
} from '@app/models/Bounty';
import axios from '@app/utils/AxiosUtils';
import {
	Alert,
	AlertIcon,
	Button,
	Box,
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Textarea,
	Tooltip,
	useColorMode,
	useDisclosure,
} from '@chakra-ui/react';
// import { useRouter } from 'next/router';
import { useState } from 'react';
import { useContext } from 'react';
import {
	actionBy,
	isClaimableByUser,
	newActivityHistory,
	newStatusHistory,
} from '@app/utils/formUtils';
import AccessibleLink from '@app/components/parts/AccessibleLink';
import { CustomerContext } from '@app/context/CustomerContext';
import { baseUrl } from '@app/constants/discordInfo';
import { useRequiredRoles } from '@app/components/global/Auth';
import { mutate } from 'swr';
import BOUNTY_STATUS from '@app/constants/bountyStatus';
import ACTIVITY from '@app/constants/activity';
import miscUtils from '@app/utils/miscUtils';
import { APIUser } from 'discord-api-types';

const BountyClaim = ({ bounty }: { bounty: BountyCollection }): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	// const router = useRouter();
	const { colorMode } = useColorMode();
	const { user } = useUser();
	const [message, setMessage] = useState<string>();
	const [claiming, setClaiming] = miscUtils.useStateCallback<boolean>(false);
	const [error, setError] = useState(false);

	const confirmBounty = async () => {
		if (message && user) {
			const claimData: BountyClaimCollection = {
				claimedBy: actionBy(user),
				submissionNotes: message,
				status: 'In-Progress',
				activityHistory: newActivityHistory(
					bounty.activityHistory as ActivityHistoryItem[],
					ACTIVITY.CLAIM
				),
				statusHistory: newStatusHistory(
					bounty.statusHistory as StatusHistoryItem[],
					BOUNTY_STATUS.IN_PROGRESS
				),
			};
			try {
				setClaiming(true, () => undefined);
				const res = await axios.patch<void, any, BountyClaimCollection>(
					`api/bounties/${bounty._id}/claim?customerId=${bounty.customerId}`,
					claimData
				);
				if (res.status === 200) {
					const bountyPageRoute = '/' + bounty._id;
					const updatedBounty = { ...bounty, ...claimData };
					mutate(`/api/bounties${bountyPageRoute}`, updatedBounty, false);
					// if (router.route !== bountyPageRoute) router.push(bountyPageRoute);
					setClaiming(false, onClose);
				}
			} catch {
				setError(true);
				setClaiming(false, () => undefined);
			}
		} else {
			setError(true);
		}
	};

	return (
		<>
			{
				// TODO This is obsolete...
				bounty.evergreen || bounty.requireApplication ? (
					// If we have discord message info for the bounty, the user is taken into discord to claim
					<ClaimDiscord canonicalCard={bounty.canonicalCard} />
				) : (
					// else, they must use the web form variant
					<ClaimWeb user={user} bounty={bounty} onOpen={onOpen} />
				)
			}
			<Modal onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Claim This Bounty</ModalHeader>
					{claiming && (
						<Alert status="success">
							<AlertIcon />
							Bounty Claimed!
						</Alert>
					)}
					{error && (
						<Alert status="error">
							<AlertIcon />
							There was a problem claiming the bounty
						</Alert>
					)}
					<ModalCloseButton />
					<ModalBody flexDirection="column" justifyContent="space-evenly">
						<Flex mb="5">
							Add a message to the bounty creator, then hit &apos;Confirm&apos; to send
							and claim the bounty.
						</Flex>
						<Textarea
							placeholder="Send a message"
							onChange={(e) => setMessage(e.target.value)}
						/>
					</ModalBody>
					<ModalFooter justifyContent="flex-end">
						<Box p={2}>
							<Button
								transition="background 100ms linear"
								disabled={!message || bounty.status !== 'Open'}
								onClick={confirmBounty}
								isLoading={claiming}
								loadingText="Submitting"
								bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
							>
								Confirm
							</Button>
						</Box>
						<Box p={2}>
							<Button onClick={onClose}>Close</Button>
						</Box>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export const ClaimDiscord = ({
	canonicalCard,
}: {
	canonicalCard: { messageId: string | undefined, channelId: string | undefined };
}): JSX.Element => {
	const {
		customer: { customerId },
	} = useContext(CustomerContext);
	const url = `${baseUrl}/${customerId}/${canonicalCard.channelId}/${canonicalCard.messageId}`;
	const { colorMode } = useColorMode();
	return (
		<AccessibleLink href={url} isExternal={true}>
			<Box p={2}>
				<Button
					boxShadow={'md'}
					transition="background 100ms linear"
					bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
					size='md'
					width='200px'
					disabled={!canonicalCard || !canonicalCard.channelId || !canonicalCard.messageId}
				>
					Claim It
				</Button>
			</Box>
		</AccessibleLink>
	);
};

export const ClaimWeb = ({
	user,
	bounty,
	onOpen,
}: {
	user: APIUser | undefined;
	bounty: BountyCollection;
	onOpen: () => void;
}): JSX.Element => {
	const { colorMode } = useColorMode();
	let canClaim = useRequiredRoles(['claim-bounties', 'admin']);
	let helpMessage = 'Claim this bounty';
	if (canClaim) {
		const { isClaimable, reason } = isClaimableByUser(bounty, user);
		if (!isClaimable) {
			canClaim = false;
			helpMessage = reason;
		}
	} else {
		helpMessage =
			'You need to sign in and have the correct permissions to claim this bounty';
	}
	return (
		<Tooltip
			hasArrow
			label={helpMessage}
			shouldWrapChildren
			mt="3"
			display={canClaim ? 'hidden' : 'inline-block'}
		>
			<Box p={2}>
				<Button
					boxShadow={'md'}
					transition="background 100ms linear"
					aria-label="claim-button"
					bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
					onClick={onOpen}
					disabled={!canClaim}
					size='md'
					width='200px'
				>
					Claim It
				</Button>
			</Box>
			<Text
				as="i"
				my={1}
				color="primary.500"
				display={canClaim ? 'none' : { base: 'block', md: 'none' }}
			>
				{helpMessage}
			</Text>
		</Tooltip>
	);
};

export default BountyClaim;
