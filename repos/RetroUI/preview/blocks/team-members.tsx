import { Avatar } from "@/components/retroui/Avatar";
import { Badge } from "@/components/retroui/Badge";
import { Text } from "@/components/retroui/Text";
import { Clock, User } from "lucide-react";

export default function TeamMembersBlock() {
    return (
        <div className="flex flex-col gap-3">
            <div
                className="border-2 p-4 flex items-center justify-between gap-3 bg-card rounded"
            >
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        <Avatar.Image
                            src="https://pub-5f7cbdfd9ffa4c838e386788f395f0c4.r2.dev/people/person_a.png"
                            alt="Person A"
                        />
                        <Avatar.Fallback>
                            <User className="h-5 w-5 text-muted-foreground" />
                        </Avatar.Fallback>
                    </Avatar>
                    <div>
                        <Text className="font-semibold">Alex Johnson</Text>
                        <span className="text-sm text-muted-foreground">alex@example.com</span>
                    </div>
                </div>
                <Badge variant="solid" size="sm">
                    Admin
                </Badge>
            </div>

            <div className="border-2 p-4 flex items-center justify-between gap-3 bg-card rounded">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        <Avatar.Image
                            src="https://pub-5f7cbdfd9ffa4c838e386788f395f0c4.r2.dev/people/person_b.png"
                            alt="Person B"
                        />
                        <Avatar.Fallback>
                            <User className="h-5 w-5 text-muted-foreground" />
                        </Avatar.Fallback>
                    </Avatar>
                    <div>
                        <Text className="font-semibold">John Doe</Text>
                        <span className="text-sm text-muted-foreground">john@example.com</span>
                    </div>
                </div>
                <Badge variant="solid" size="sm">
                    Member
                </Badge>
            </div>

            <div className="border-2 p-4 flex items-center justify-between gap-3 bg-card rounded">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        <Avatar.Image
                            src="https://pub-5f7cbdfd9ffa4c838e386788f395f0c4.r2.dev/people/person_c.png"
                            alt="Person C"
                        />
                        <Avatar.Fallback>
                            <User className="h-5 w-5 text-muted-foreground" />
                        </Avatar.Fallback>
                    </Avatar>
                    <div>
                        <Text className="font-semibold">Jane Smith</Text>
                        <span className="text-sm text-muted-foreground">jane@example.com</span>
                    </div>
                </div>


                <Badge variant="surface" size="sm">
                    Pending
                </Badge>
            </div>
        </div>
    );
}