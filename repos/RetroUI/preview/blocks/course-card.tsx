import { Card } from "@/components/retroui/Card";
import { Badge } from "@/components/retroui/Badge";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";

const CourseCard = () => {
    return (
        <div className="flex justify-center">
            <Card className="w-[400px] mx-auto border-2 shadow-none">
                {/* Course Content */}
                <Card.Content>
                    {/* Title & Price */}
                    <div className="flex justify-between items-start mb-2 gap-6">
                        <Card.Title className="font-sans">
                            Advanced React Patterns
                        </Card.Title>
                        <div>
                            <Badge className="font-medium">
                                $49.99
                            </Badge>
                        </div>
                    </div>

                    {/* Description */}
                    <Text className="text-sm font-normal text-muted-foreground mb-4">
                        Master advanced React patterns and build scalable applications with
                        best practices.
                    </Text>

                    {/* Stats */}
                    <div className="flex text-sm justify-between gap-4 py-4 border-y-2 border-black/10 mb-4">
                        <div className="flex items-center gap-1">
                            <span>📚</span>
                            <span className="font-medium">12 Modules</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>⭐</span>
                            <span className="font-medium">4.9/5</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>👥</span>
                            <span className="font-medium">2.1k enrolled</span>
                        </div>
                    </div>

                    <Button className="w-full font-bold font-sans justify-center">
                        Enroll Now →
                    </Button>
                </Card.Content>
            </Card>
        </div>
    );
};

export default CourseCard;