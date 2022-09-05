import { catchError, Observable, of } from "rxjs";
import { MessageBuilder, Webhook } from "discord-webhook-node";

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

import * as Sentry from "@sentry/node";

@Injectable()
export class SentryInterceptor implements NestInterceptor {
    private readonly hook = new Webhook(process.env.DISCORD_WEBHOOK);

    public intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            catchError(async error => {
                if (error instanceof Error) {
                    Sentry.captureException(error);

                    let embed = new MessageBuilder()
                        .setTitle("⚠️ Exception just caught")
                        .setColor(16711680)
                        .addField("Message", error.message);

                    if (error.stack) {
                        embed = embed.addField("Stacktrace", error.stack.split("\n").slice(1).join("\n"));
                    }

                    await this.hook.send(embed);
                }

                return of(error);
            }),
        );
    }
}
