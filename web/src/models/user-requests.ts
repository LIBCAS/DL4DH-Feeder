export enum UserRequestType {
	ENRICHMENT = 'ENRICHMENT',
	EXPORT = 'EXPORT',
}
export enum UserRequestState {
	CREATED = 'CREATED',
	IN_PROGRESS = 'IN_PROGRESS',
	WAITING_FOR_USER = 'WAITING_FOR_USER',
	APPROVED = 'APPROVED',
	PROLONGING = 'PROLONGING',
	REJECTED = 'REJECTED',
}

export type UserRequestDto = {
	id: string;
	created: string;
	updated: string;
	type: UserRequestType;
	state: UserRequestState;
	username: string;
	identification: string;
	parts: UserRequestPartDto[];
	messages: MessageDto[];
};

export type UserRequestPartDto = {
	publicationId: string;
	state: UserRequestState;
	note: string;
	stateUntil: string;
};
export type MessageDto = {
	id: string;
	message: string;
	files: FileRefDto[];
};

export type FileRefDto = {
	// TODO:
	id: string;
	name: string;
};

export type UserRequestListDto = {
	created: string;
	id: string;
	identification: string;
	state: UserRequestState;
	type: UserRequestType;
	updated: string;
};

export type UserRequestCreateDto = {
	type: UserRequestType;
	publicationIds: string[];
	message: string;
};
