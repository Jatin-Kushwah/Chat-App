import { Stack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";

function ChatLoading() {
    return (
        <Stack spacing="1rem">
            <Skeleton width="325px" padding="8px" borderRadius="10px">
                <div>dummy</div>
                <div>dummy</div>
            </Skeleton>
            <Skeleton width="325px" padding="8px" borderRadius="10px">
                <div>dummy</div>
                <div>dummy</div>
            </Skeleton>
            <Skeleton width="325px" padding="8px" borderRadius="10px">
                <div>dummy</div>
                <div>dummy</div>
            </Skeleton>
            <Skeleton width="325px" padding="8px" borderRadius="10px">
                <div>dummy</div>
                <div>dummy</div>
            </Skeleton>
            <Skeleton width="325px" padding="8px" borderRadius="10px">
                <div>dummy</div>
                <div>dummy</div>
            </Skeleton>
            <Skeleton width="325px" padding="8px" borderRadius="10px">
                <div>dummy</div>
                <div>dummy</div>
            </Skeleton>
            <Skeleton width="325px" padding="8px" borderRadius="10px">
                <div>dummy</div>
                <div>dummy</div>
            </Skeleton>
            <Skeleton width="325px" padding="8px" borderRadius="10px">
                <div>dummy</div>
                <div>dummy</div>
            </Skeleton>
        </Stack>
    );
}

export default ChatLoading;
