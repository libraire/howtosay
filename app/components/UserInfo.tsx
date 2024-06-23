"use client"

type Props = {
    expire: string,
    user: string
};

export default function UserInfo({ expire, user }: Props) {

    return (
        <div className="border-b border-gray-100">
            <div className="flex gap-2 items-center ml-2  mt-4 px-2 pb-4">
                <div className="flex flex-col space-y-3 text-gray-900 ">
                    <div className="text-s leading-none text-muted-foreground">
                        {user}
                    </div>

                    {expire && <div className="text-sm leading-none text-muted-foreground">
                        Expire at: {expire}
                    </div>}
                </div>

            </div>
        </div>
    )
}
