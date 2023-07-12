import React, { useEffect, useState } from "react";
import { Stack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";

function ChatLoading({ count }) {
    const [skeletonCount, setSkeletonCount] = useState(1);

    useEffect(() => {
        setSkeletonCount(count);
    }, [count]);

    return (
        <Stack spacing="1rem">
            {Array(skeletonCount)
                .fill()
                .map((_, index) => (
                    <Skeleton key={index} width="325px">
                        <div>dummy</div>
                        <div>dummy</div>
                    </Skeleton>
                ))}
        </Stack>
    );
}

export default ChatLoading;
