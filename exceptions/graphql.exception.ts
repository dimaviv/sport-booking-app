import {ArgumentsHost, Catch} from '@nestjs/common';
import {GqlArgumentsHost, GqlExceptionFilter} from '@nestjs/graphql';
import {GraphQLError} from 'graphql';




@Catch(GraphQLError)
export class GqlCustomExceptionFilter implements GqlExceptionFilter {
    catch(exception: GraphQLError, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);
        console.log('works')
        console.log(exception)
        return {
            message: exception.message,
            extensions: {
                code: 'CUSTOM_CODE',
                response: {
                    message: [exception.message],
                    statusCode: 400,
                    error: 'Bad Request',
                },
            },
        };
    }
}
