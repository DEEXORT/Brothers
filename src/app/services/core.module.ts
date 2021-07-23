// import {Injectable, InjectionToken, Injector, NgModule, Optional, SkipSelf} from '@angular/core';
// import {
//   HTTP_INTERCEPTORS,
//   HttpClient,
//   HttpClientModule, HttpEvent,
//   HttpHandler,
//   HttpInterceptor,
//   HttpRequest
// } from '@angular/common/http';
// import * as http from "http";
// import {Observable} from "rxjs";
//
// @NgModule({
//   providers: [
//     AuthService,
//     {
//       provide: HTTP_INTERCEPTORS,
//       // Этим interceptor`ом будем добавлять auth header
//       useClass: ApplyTokenInterceptor,
//       multi: true
//     },
//     {
//       provide: HTTP_INTERCEPTORS,
//       // этим будем соответственно рефрешить
//       useClass: RefreshTokenInterceptor,
//       multi: true
//     }
//   ],
//   exports: [HttpClientModule]
// })
//
// export class CoreModule {
//   // @Optional() @SkipSelf() - если вдруг мы попытаемся импортировать CoreModule в AppModule и например UserModule - получим ошибку
//   constructor(@Optional() @SkipSelf() parentModule: CoreModule,
//               userService: UserService,
//               inj: Injector,
//               auth: AuthService,
//               http: HttpClient) {
//
//     // Получаем интерцепторы которые реализуют интерфейс AuthInterceptor
//     let interceptors = inj.get<AuthInterceptor[]>(HTTP_INTERCEPTORS)
//       .filter(i => {
//         return i.init;
//       });
//     // передаем http сервис и сервис авторизации.
//     interceptors.forEach(i => i.init(http, auth));
//
//     userService.init();
//
//     if (parentModule) {
//       // если мы здесь, значит случайно включили CoreModule в двух и более местах
//       throw new Error(
//         'CoreModule is already loaded. Import it in the AppModule only');
//     }
//   }
// }
//
// export interface AuthInterceptor {
//   init(http: HttpClient, auth: AuthRefreshProvider);
// }
//
// export const HTTP_INTERCEPTORS = new InjectionToken<HttpInterceptor[]>('HTTP_INTERCEPTORS');
//
// @Injectable()
// export class ApplyTokenInterceptor implements HttpInterceptor, AuthInterceptor {
//
//   private http: HttpClient;
//
//   constructor(private injector: Injector) {
//   }
//
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     //забираем HttpClient в при каждом перехвате запроса
//     if (!http) {
//       this.http = injector.get(HttpClient);
//     }
//   }
// }
