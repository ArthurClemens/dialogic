/// <reference types="../../node_modules/@types/mithril" />
import { Dialogic } from "dialogic";
import m from "mithril";
export declare const Instance: <T = unknown>({ attrs: componentAttrs, }: {
    attrs: Dialogic.DialogicalInstanceOptions<T>;
}) => {
    oncreate: (vnode: {
        dom: Element;
    }) => void;
    view: ({ attrs }: {
        attrs: Dialogic.DialogicalInstanceOptions<T>;
    }) => m.Vnode<any, any>;
};
