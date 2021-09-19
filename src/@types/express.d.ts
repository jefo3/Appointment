// sobreacrevendo a biblioteca express para ter o user id
// nao apaga as outras info do express mas add essa q a gente ta colocando
declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}
