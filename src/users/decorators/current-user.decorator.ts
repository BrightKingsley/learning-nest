import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Session } from "inspector";

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log(request.session.userId);
    return request.currentUser;
  },
);
