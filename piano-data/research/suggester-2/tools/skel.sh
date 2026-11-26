#!/bin/sh
# skeleton: calls, strings, control flow, constants
$(dirname $0)/fn.sh "$1" "$2" | grep -E '^// =====|\{[a-zA-Z]|S"|^\s*(if|while|for|do|return|goto|LAB_|switch|case|else)|_kclass_|lRam00000000009b|<[A-Z][A-Za-z]*\.' | grep -v 'slowPathEv\|ThreadRegistry\|GC\|Allocate\|UpdateHeapRef\|UpdateStackRef\|ZeroHeapRef\|safePoint\|SafePoint' | sed 's/{\([^}]*\)}/{\1}/g' | cut -c1-260
