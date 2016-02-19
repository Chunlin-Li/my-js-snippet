{
  "targets": [
    {
      "target_name":"addon",
      "sources": [
        "addon.cc",
        "hello.cc"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
